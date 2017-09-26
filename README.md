# Run As

VSCode extension.

## What can it do ?

Right Click a file, then
- Run as javascript in node
  - Run as a simple javascript's test in node
- Run as javascript's unit test in mocha
- Run as script in shell
  - Run a task by right-clicking a script instead of typing a command
    - Run a server in a new terminal windows
    - Run a watcher in a new terminal windows
    - and so on
- Run as the parameter of application
  - Open file with default application
  - Open file with the application you like
- and so on

## Useage

After configuration, right Click a file, then select menu item "Run as ...".

![preview](./images/preview.png)

## Configuration

Opew VSCode `setting` (Ctrl+Comma), search for "runas" to change configuration:

1. Globs-to-command mapping

    ```json
    "RunAs.globsMapToCommand": [{
        "globs": "*.*",
        "command": {
                "win32": "start $1",
                "linux": "see $1",
                "darwin": "open $1"
            },
        "exceptions": [
            {
                "globs": "*.+(bat|cmd|exe)",
                "command": "$1"
            },
            {
                "globs": "*.js",
                "command": "node $1",
                "exceptions": [
                    {
                        "globs": "*.spec.js",
                        "command": "mocha $1"
                    }
                ]
            }
        ]
    }]
    ```

    - [globs](https://github.com/isaacs/node-glob): A pattern to match file's path name.
    - command: The command run in shell after selecting menu item "Run as ...".
      - command can be a general command or a platform-to-command map, just like `"node $1"` or `{ "win32": "start $1", "linux": "see $1", "darwin": "open $1" }`.
      - `$1` will be replaced by `<filePathName>` when it execute.
        - `$1` does not surround by `"`, white spaces in `<filePathName>` will be surrounded by `"` automatically.
    - exceptions: A array of globs-to-command mapping, files matched one of them will execute itself command instead of it's parent's command.

2. Execute command in a new terminal windows

    ```json
    "RunAs.runInNewTerminalWindows.enable": false,
    "RunAs.runInNewTerminalWindows.commands": {
        "win32": "start $0"
    }
    ```

    In `"RunAs.runInNewTerminalWindows.commands"`,
    - the key is platform string in VSCode, e.g. `"win32"`;
        - Windows: `"win32"`,
        - Linux: `"linux"`
        - Mac OS: `"darwin"`
    - the value is the command to execute command in a new terminal windows in this platform, e.g. `"start $0"`.
        - `$0` will be replaced by the command in globs-to-command mapping.

    You can enable it by change `"RunAs.runInNewTerminalWindows.enable"` to `true`.

## Install

```
ext install run-as
```

## Issue

- I do not know how to pass a command to a new terminal to execute it in Mac OS, but you can configure it by yourself.

## About

Author：plylrnsdy

Github：[vscode-extension-run-as](https://github.com/plylrnsdy/vscode-extension-run-as)