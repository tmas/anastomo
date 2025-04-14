anastomo
=================

![Anastomo Logo](logo.svg)

A build tool for managing multiple frontend build pipelines while maintaining assets in a single location


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/anastomo.svg)](https://npmjs.org/package/anastomo)
[![Downloads/week](https://img.shields.io/npm/dw/anastomo.svg)](https://npmjs.org/package/anastomo)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g anastomo
$ anastomo COMMAND
running command...
$ anastomo (--version)
anastomo/0.0.1 linux-x64 node-v22.14.0
$ anastomo --help [COMMAND]
USAGE
  $ anastomo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`anastomo help [COMMAND]`](#anastomo-help-command)
* [`anastomo plugins`](#anastomo-plugins)
* [`anastomo plugins add PLUGIN`](#anastomo-plugins-add-plugin)
* [`anastomo plugins:inspect PLUGIN...`](#anastomo-pluginsinspect-plugin)
* [`anastomo plugins install PLUGIN`](#anastomo-plugins-install-plugin)
* [`anastomo plugins link PATH`](#anastomo-plugins-link-path)
* [`anastomo plugins remove [PLUGIN]`](#anastomo-plugins-remove-plugin)
* [`anastomo plugins reset`](#anastomo-plugins-reset)
* [`anastomo plugins uninstall [PLUGIN]`](#anastomo-plugins-uninstall-plugin)
* [`anastomo plugins unlink [PLUGIN]`](#anastomo-plugins-unlink-plugin)
* [`anastomo plugins update`](#anastomo-plugins-update)

## `anastomo help [COMMAND]`

Display help for anastomo.

```
USAGE
  $ anastomo help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for anastomo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.27/src/commands/help.ts)_

## `anastomo plugins`

List installed plugins.

```
USAGE
  $ anastomo plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ anastomo plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/index.ts)_

## `anastomo plugins add PLUGIN`

Installs a plugin into anastomo.

```
USAGE
  $ anastomo plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into anastomo.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ANASTOMO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ANASTOMO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ anastomo plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ anastomo plugins add myplugin

  Install a plugin from a github url.

    $ anastomo plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ anastomo plugins add someuser/someplugin
```

## `anastomo plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ anastomo plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ anastomo plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/inspect.ts)_

## `anastomo plugins install PLUGIN`

Installs a plugin into anastomo.

```
USAGE
  $ anastomo plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into anastomo.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ANASTOMO_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ANASTOMO_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ anastomo plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ anastomo plugins install myplugin

  Install a plugin from a github url.

    $ anastomo plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ anastomo plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/install.ts)_

## `anastomo plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ anastomo plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ anastomo plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/link.ts)_

## `anastomo plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ anastomo plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ anastomo plugins unlink
  $ anastomo plugins remove

EXAMPLES
  $ anastomo plugins remove myplugin
```

## `anastomo plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ anastomo plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/reset.ts)_

## `anastomo plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ anastomo plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ anastomo plugins unlink
  $ anastomo plugins remove

EXAMPLES
  $ anastomo plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/uninstall.ts)_

## `anastomo plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ anastomo plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ anastomo plugins unlink
  $ anastomo plugins remove

EXAMPLES
  $ anastomo plugins unlink myplugin
```

## `anastomo plugins update`

Update installed plugins.

```
USAGE
  $ anastomo plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.36/src/commands/plugins/update.ts)_
<!-- commandsstop -->
