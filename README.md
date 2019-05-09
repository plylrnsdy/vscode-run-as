# Run As

[![Marketplace](https://vsmarketplacebadge.apphb.com/version/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Installs](https://vsmarketplacebadge.apphb.com/installs/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as)

### README in Other Languages
[简体中文](https://github.com/plylrnsdy/vscode-run-as/blob/master/docs/README.zh-cn.md)

## Features

1. **Right Click a file**, then
    - Run `*.js` in node
    - Run `*.ts` corresponding compiled `*.js` in node
    - Run `*.bat`, `*.cmd`, `*.sh` to start a **task**:
        - Run a **watcher** in a new integrated terminal in vscode
        - Run a **server** in a new terminal windows out of vscode
    - Open `binary file` in default application or the application you like
2. Automatic switch working directory when run different file in a different folder in the workspace.
3. [**New!**](#13-globs-to-cmdmode)  More mode to control the behavior of terminal and panel.

## Usage

After configuration, right Click a file, then select the menu item "Run As ...".

![preview](https://github.com/plylrnsdy/vscode-run-as/raw/master/images/run-in-inner-terminal.gif)

## Configuration

Open VSCode `setting` (Ctrl+Comma), search for "runas" to change configuration:

### 1. Globs-to-command mapping

An array of `globs-to-cmd`.

```json
"RunAs.globsMapToCommand": [...]
```

`globs-to-cmd` structure:

```json
{
    "globs": "*.*",
    "mode": "silent",
    "command": {
        "win32": "start ${rPath}",
        "linux": "see ${rPath}",
        "darwin": "open ${rPath}"
    },
    "exceptions": [...] // An array of `globs-to-cmd`.
}
```

#### 1.1 `globs-to-cmd`.[globs][globs]

A pattern to match file's path name.

```json
{
    "globs": "\\[*\\]*.cmd",
    // ...
}
```

**PS:** you need to use `\\` instead of `\` to _escape_ character in Globs.

#### 1.2 `globs-to-cmd`.command

The command runs in shell after selecting the menu item "Run as ...".

**1.2.1 command template(s)**

- A general command, example: 

    ```json
    {
        // ...
        "command": "node ${rPath}"
    }
    ```

- Or a platform-to-command map, example: 

    ```json
    {
        // ...
        "command": {
            "win32": "start ${rPath}",
            "linux": "see ${rPath}",
            "darwin": "open ${rPath}"
        }
    }
    ```

**1.2.2 command argument - path: `${...}`**

A javascript code snippet, it looks like `${/* javascript */}`. It can be: 

1. A **variable**, example: `${rPath}`
2. A **template string**, example: `` ${`out/${dir}/${sFile}.js`} ``
    - See: [Table: Variable Meaning](#table-variable-meaning)
3. A **javascript code snippet**, example: `${file.replace(/(\\/(?:src|test)\\/)/, '/out$1').replace(/ts$/, 'js')}`, this code snippet in default configuration means right click to run *.ts but actually execute the *.js in folder `out`.
    - **PS:** you need to use `\\` instead of `\` to _escape_ character in RegExp literal.

**1.2.3 command prefix: `@` + [terminal mode](#13-globs-to-cmdmode)**

A quick way to set terminal mode for one command.

```json
{
    // ...
    "command": "@silent start ${rPath}"
}
```

#### 1.3 `globs-to-cmd`.mode

```json
{
    // ...
    "mode": "silent",
}
```

Set terminal mode for commands on different platforms, it decides the behaviors of the terminal and the panel. Default value is equal to `"RunAs.runInNewTerminalWindows.enable"`.

Available terminal mode: 

1. `silent`: Execute a command in the integrated terminal, but don't show the panel if you had not opened it.
2. `in`: Execute a command in the integrated terminal, and show the panel for printing the results.
3. `block`: Execute a command in a *new integrated* terminal for a task which will block the terminal.
4. `out`: Execute a command in a *new* terminal window out of vscode.

#### 1.4 `globs-to-cmd`.exceptions

A array of globs-to-command mapping, files matched one of them will execute itself command instead of its parent's command.

```json
{
    // ...
    "exceptions": [{
        "globs": "*.@(bat|cmd|exe)",
        "command": ".\\${rPath}"
    }]
}
```

#### Table: Variable Meaning

| Variable | Meaning                                          | Example                                   |
| -------- | ------------------------------------------------ | ----------------------------------------- |
| `file`    | full path of the file which you right clicked    | `D:\projects\project\src\common\module.ts` |
| `root`    | the folder opened in vscode                      | `D:\projects\project`                      |
| `rPath`   | the relative path from `root` to file             | `src\common\module.ts`                     |
| `dir`     | the relative path from `root` to file's directory | `src\common`                               |
| `lFile`   | the file's name with extension                   | `module.ts`                                |
| `sFile`   | the file's name without extension                | `module`                                   |
| `ext`     | the file's extension                             | `ts`                                       |

### 2. Execute command in a new terminal windows

```json
"RunAs.runInNewTerminalWindows": {
    "enable": false,
    "globs": "New Terminal Window",
    "command": {
        "win32": "Start-Process cmd -ArgumentList '/c ${command}'",
        "linux": "gnome-terminal -x bash -c '${command}'"
    }
}
```

In `"RunAs.runInNewTerminalWindows.commands"`,
- The key is platform string in VSCode:
    - Windows: `"win32"`,
    - Linux: `"linux"`
    - Mac OS: `"darwin"`
- The value is the command to execute a command in a new terminal windows in this platform, e.g. `"start ${command}"`.
    - `${command}` will be replaced by the command in globs-to-command mapping.

You can run the command in a new terminal windows in default by changing `"RunAs.runInNewTerminalWindows.enable"` to `true`, or you can use the prefix `@out` in the command to use it alone.

## Install

Press `F1` in VSCode, type `ext install` and then look for `"Run as ..."` .

## Known Issue

- I do not know how to pass a command to a new terminal to execute it in Mac OS, but you can configure it by yourself.

## Issues

Submit the [issues][issues] if you find any bug or have any suggestion.

## Contribution

Fork the [repository][repository] and submit pull requests.

## About

Author：plylrnsdy

Github：[vscode-run-as][repository]



[globs]:https://github.com/isaacs/node-glob
[issues]:https://github.com/plylrnsdy/vscode-run-as/issues
[repository]:https://github.com/plylrnsdy/vscode-run-as