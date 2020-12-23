<p align="center">
  <a href="https://www.linkedin.com/in/hannah-morten-b1218017a/"><img height="200" style="height:200px;" src="https://github.com/cmorten/opine-cli/raw/main/.github/icon.png" alt="Deno reading an opinionated book"></a>
  <h1 align="center">Opine CLI</h1>
</p>
<p align="center">
<a href="https://github.com/asos-craigmorten/opine">Opine's</a> application generator.</p>
<p align="center">
   <a href="https://github.com/cmorten/opine-cli/tags/"><img src="https://img.shields.io/github/tag/cmorten/opine-cli" alt="Current version" /></a>
   <img src="https://github.com/cmorten/opine-cli/workflows/Test/badge.svg" alt="Current test status" />
   <a href="https://doc.deno.land/https/deno.land/x/opinecli/opine-cli.ts"><img src="https://doc.deno.land/badge.svg" alt="Deno docs" /></a>
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs are welcome" /></a>
   <a href="https://github.com/cmorten/opine-cli/issues/"><img src="https://img.shields.io/github/issues/cmorten/opine-cli" alt="Opine CLI issues" /></a>
   <img src="https://img.shields.io/github/stars/cmorten/opine-cli" alt="Opine CLI stars" />
   <img src="https://img.shields.io/github/forks/cmorten/opine-cli" alt="Opine CLI forks" />
   <img src="https://img.shields.io/github/license/cmorten/opine-cli" alt="Opine CLI license" />
   <a href="https://github.com/cmorten/opine-cli/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Opine CLI is maintained" /></a>
   <a href="http://hits.dwyl.com/cmorten/opine-cli"><img src="http://hits.dwyl.com/cmorten/opine.svg" alt="Opine CLI repository visit count" /></a>
   <a href="https://nest.land/package/opinecli"><img src="https://nest.land/badge.svg" alt="Published on nest.land" /></a>
</p>

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Command Line Options](#command-line-options)
- [Contributing](#contributing)
- [License](#license)

## Installation

```console
$ deno install -f -q --allow-read --allow-write --unstable https://deno.land/x/opinecli@0.1.1/opine-cli.ts
```

And follow any suggestions to update your `PATH` environment variable.

## Quick Start

The quickest way to get started with Opine is to utilize the Opine CLI to generate an application as shown below:

Create the app:

```console
$ opine-cli --view=ejs hello-deno && hello-deno
```

Start your Opine app at `http://localhost:3000/`:

```console
$ deno run --allow-net --allow-read --allow-env mod.ts
```

## Command Line Options

This CLI can be further configured with the following command line flags:

```txt
-h, --help                      - Show this help.                            
-V, --version                   - Show the version number for this program.  
-v, --view     <engine:string>  - add view <engine> support (ejs|eta)        
-g, --git                       - add .gitignore                             
-f, --force                     - force on non-empty directory     
```

## Contributing

[Contributing guide](https://github.com/cmorten/opine-cli/blob/main/.github/CONTRIBUTING.md)

---

## License

There are several third party modules that have been ported into this module. Each third party module has maintained it's license and copyrights. The only exception is for Express Generator, from which this entire module has been ported, whose license and copyrights are available at [EXPRESS_GENERATOR_LICENSE](./EXPRESS_GENERATOR_LICENSE.md) in the root of this repository, and cover all files within the [source](./src) directory which not been explicitly licensed otherwise.

All modules adapted into this module are licensed under the MIT License.

Opine CLI is licensed under the [MIT License](./LICENSE.md).

Icon designed and created by [Hannah Morten](https://www.linkedin.com/in/hannah-morten-b1218017a/).
