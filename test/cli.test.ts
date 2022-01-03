import { describe, it } from "./utils.ts";
import { expect } from "./deps.ts";

const denoRunCommandPrefix = [
  "deno",
  "run",
  "--allow-read",
  "--allow-write",
  "--allow-net",
  "--unstable",
];

describe("(no flags)", () => {
  it("should create basic app", async () => {
    const tmpDir = await Deno.makeTempDir(
      { prefix: "opine_cli", suffix: "basic_app" },
    );
    const command = ["./opine-cli.ts", tmpDir];

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, ...command],
      stdout: "inherit",
      stderr: "inherit",
    });

    expect(await process.status()).toEqual({ code: 0, success: true });

    await process.close();
    await Deno.remove(tmpDir, { recursive: true });
  });
});

describe("ejs view", () => {
  it("should create an app with ejs views", async () => {
    const tmpDir = await Deno.makeTempDir(
      { prefix: "opine_cli", suffix: "basic_app" },
    );
    const command = ["./opine-cli.ts", "--view", "ejs", tmpDir];

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, ...command],
      stdout: "inherit",
      stderr: "inherit",
    });

    expect(await process.status()).toEqual({ code: 0, success: true });

    await process.close();
    await Deno.remove(tmpDir, { recursive: true });
  });
});

describe("eta view", () => {
  it("should create an app with eta views", async () => {
    const tmpDir = await Deno.makeTempDir(
      { prefix: "opine_cli", suffix: "basic_app" },
    );
    const command = ["./opine-cli.ts", "--view", "eta", tmpDir];

    const process = await Deno.run({
      cmd: [...denoRunCommandPrefix, ...command],
      stdout: "inherit",
      stderr: "inherit",
    });

    expect(await process.status()).toEqual({ code: 0, success: true });

    await process.close();
    await Deno.remove(tmpDir, { recursive: true });
  });
});
