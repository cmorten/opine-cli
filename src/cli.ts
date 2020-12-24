import {
  Command,
  Confirm,
  dirname,
  fromFileUrl,
  join,
  renderToString,
  resolve,
  sep,
} from "../deps.ts";
import { VERSION } from "../version.ts";

const MODE_0666 = parseInt("0666", 8);
const MODE_0755 = parseInt("0755", 8);
const TEMPLATE_DIR = getTemplateDirectory();
console.log({ TEMPLATE_DIR });

const program = await new Command()
  .name("opine-cli")
  .version(VERSION)
  .description("Opine's application generator.")
  .arguments("[option] [dir]")
  .option(
    "-v, --view <engine>",
    "add view <engine> support (ejs|eta)",
  )
  .option("-g, --git", "add .gitignore")
  .option("-f, --force", "force on non-empty directory")
  .parse(Deno.args);

main();

/**
 * Prompt for confirmation on STDOUT / STDIN
 * 
 * @param {string} msg
 * @returns {Promise<boolean>}
 * @private
 */
async function confirm(message: string): Promise<boolean> {
  return await Confirm.prompt({
    message,
  });
}

/**
 * Read a remote file.
 * 
 * @param {string} from 
 * @returns {Promise<string>}
 * @private
 */
async function readRemote(from: string): Promise<string> {
  const response = await fetch(from);

  return await response.text();
}

/**
 * Reads a file.
 * 
 * @param {string} from 
 * @returns {string|Promise<string>}
 * @private
 */
function read(from: string): string | Promise<string> {
  console.log("read", { from });

  if (from.startsWith("http:") || from.startsWith("https:")) {
    console.log("read resolved", { from });
    return readRemote(from);
  }

  console.log("read resolved", { from });

  return Deno.readTextFileSync(from);
}

/**
 * Copy file from template directory.
 *
 * @param {string} from 
 * @param {string} to
 * @private
 */
async function copyTemplate(from: string, to: string): Promise<void> {
  console.log("copyTemplate", { from, to });

  write(to, await read(join(TEMPLATE_DIR, from)));
}

/**
 * Copy multiple files from template directory.
 * 
 * @param {string} fromDir
 * @param {string} toDir
 * @param {string} nameGlob
 * @private
 */
function copyTemplateMulti(
  fromDir: string,
  toDir: string,
  files: string[],
): void {
  files
    .forEach(async (file) => {
      await copyTemplate(join(fromDir, file), join(toDir, file));
    });
}

/**
 * Create application at the given directory.
 *
 * @param {string} name
 * @param {string} dir
 * @private
 */
async function createApplication(
  directory: string,
): Promise<void> {
  console.log();

  const app = loadTemplate("js/app.ts");
  const deps = loadTemplate("js/deps.ts");

  if (directory !== ".") {
    mkdir(directory, ".");
  }

  mkdir(directory, "public");
  mkdir(directory, "public/js");
  mkdir(directory, "public/images");
  mkdir(directory, "public/css");

  copyTemplateMulti("css", `${directory}/public/css`, ["style.css"]);
  copyTemplateMulti("js", `${directory}`, ["mod.ts"]);

  mkdir(directory, "routes");
  copyTemplateMulti(
    "js/routes",
    `${directory}/routes`,
    ["index.ts", "users.ts"],
  );

  let flags = "--allow-net --allow-read --allow-env";

  if (program.options.view) {
    mkdir(directory, "views");

    switch (program.options.view) {
      case "eta": {
        app.locals.view = {
          engine: "eta",
          render: "renderFile",
        };
        deps.locals.view = {
          render:
            `export { renderFile } from "https://deno.land/x/eta@v1.12.1/mod.ts";`,
        };

        flags += " --unstable";

        copyTemplateMulti(
          "views",
          `${directory}/views`,
          ["error.eta", "index.eta"],
        );

        break;
      }
      case "ejs":
      default: {
        app.locals.view = {
          engine: "ejs",
          render: "renderFileToString",
        };
        deps.locals.view = {
          render:
            `export { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";`,
        };

        copyTemplateMulti(
          "views",
          `${directory}/views`,
          ["error.ejs", "index.ejs"],
        );

        break;
      }
    }
  } else {
    app.locals.view = false;
    deps.locals.view = false;
    await copyTemplate("js/index.html", join(directory, "public/index.html"));
  }

  if (program.options.git) {
    await copyTemplate("js/gitignore", join(directory, ".gitignore"));
  }

  write(join(directory, "app.ts"), await app.render());
  write(join(directory, "deps.ts"), await deps.render());

  const prompt = launchedFromCmd() ? ">" : "$";

  if (directory !== ".") {
    console.log();
    console.log("   change directory:");
    console.log(`     ${prompt} cd ${directory}`);
  }

  console.log();
  console.log("   run the app:");
  console.log(`     ${prompt} deno run ${flags} mod.ts`);
  console.log();
}

/**
 * Check if the given directory is empty.
 *
 * @param {string} directory
 * @returns {boolean}
 * @private
 */
function emptyDirectory(directory: string): boolean {
  try {
    const items = [...Deno.readDirSync(directory)];

    return !items?.length;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  return true;
}

/**
 * Determine the OS type.
 * 
 * @returns {string}
 * @private
 */
function osType(): "darwin" | "linux" | "windows" {
  if (globalThis.Deno != null) {
    return Deno.build.os;
  }

  // deno-lint-ignore no-explicit-any
  const navigator = (globalThis as any).navigator;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }

  return "linux";
}

/**
 * Determine if launched from cmd.exe
 * 
 * @returns {boolean}
 * @private
 */
function launchedFromCmd(): boolean {
  return osType() === "windows";
}

/**
 * Load template file.
 * 
 * @param {string} name
 * @returns {object}
 * @private
 */
function loadTemplate(
  name: string,
): {
  locals: Record<string, unknown>;
  render: () => Promise<string>;
} {
  const file = resolve(TEMPLATE_DIR, `${name}.ejs`);
  const locals = Object.create(null);

  async function render() {
    const contents = await read(file);

    return renderToString(contents, locals);
  }

  return {
    locals: locals,
    render: render,
  };
}

/**
 * Main entrypoint.
 * @private
 */
async function main(): Promise<void> {
  const directory = program.args.shift() || ".";
  const empty = emptyDirectory(directory);

  if (empty || program.options.force) {
    await createApplication(directory);
  } else {
    const ok = await confirm("destination is not empty, continue? [y/N] ");

    if (ok) {
      await createApplication(directory);
    } else {
      console.error("aborting");
      Deno.exit(1);
    }
  }
}

/**
 * Make the given dir relative to base.
 *
 * @param {string} base
 * @param {string} directory
 * @private
 */
function mkdir(base: string, directory: string): void {
  const location = join(base, directory);
  console.log(`   \x1b[36mcreate\x1b[0m : ${location}${sep}`);
  Deno.mkdirSync(location, { mode: MODE_0755, recursive: true });
}

/**
 * echo str > file.
 *
 * @param {string} file
 * @param {string} str
 * @param {number} mode
 * @private
 */
function write(file: string, str: string, mode?: number): void {
  console.log("write", { file });
  Deno.writeTextFileSync(file, str, { mode: mode ?? MODE_0666 });
  console.log(`   \x1b[36mcreate\x1b[0m : ${file}`);
}

/**
 * Get the template directory
 * 
 * @returns {string}
 * @private
 */
function getTemplateDirectory(): string {
  let __dirname = dirname(import.meta.url);
  __dirname = __dirname.startsWith("file:")
    ? fromFileUrl(__dirname)
    : __dirname;

  return join(__dirname, "templates");
}
