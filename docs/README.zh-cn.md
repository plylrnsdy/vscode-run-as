# Run As

[![Marketplace](https://vsmarketplacebadge.apphb.com/version/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Installs](https://vsmarketplacebadge.apphb.com/installs/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as) [![Ratings](https://vsmarketplacebadge.apphb.com/rating-short/plylrnsdy.run-as.svg)](https://marketplace.visualstudio.com/items/plylrnsdy.run-as)

配置，然后右键 运行/打开 一个文件。

## 使用

完成配置后，在文件管理器中，右键单击一个文件，选择菜单项“运行为 ...”。

![预览](https://github.com/plylrnsdy/vscode-run-as/raw/master/images/run-in-inner-terminal.gif)

## 用途

1. **右键单击一个文件**，然后
    - 使用 node 运行 `*.js`
    - 使用 mocha 运行 `*.spec.js`
    - 使用 node 运行 `*.ts` 对应的编译后的 `*.js`
    - 使用 mocha 运行 `*.spec.ts` 对应的编译后的 `*.spec.js` 
    - 使用终端运行 `*.bat`, `*.cmd`, `*.sh`
    - 通过右键单击一个脚本文件运行 **任务** ，而不是通过输入命令
        - 在新的终端窗口中，运行 **服务器**
        - 在新的终端窗口中，运行 **监听器**，以自动 编译、刷新浏览器……
        - 等等
    - 打开不同的 `二进制文件`
        - 在不同的应用中
        - 在你喜欢的应用中
    - 等等
2. 当运行工作区中不同项目的文件时，自动切换工作目录。

## 配置

打开 VSCode `设置` (Ctrl+逗号), 搜索 "runas"，然后更改配置：

### 1. Globs 到命令的映射

```json
"RunAs.globsMapToCommand": [{
    "globs": "*.*",
    "command": {
        "win32": "start ${rPath}",
        "linux": "see ${rPath}",
        "darwin": "open ${rPath}"
    },
    "exceptions": [{
        "globs": "*.@(bat|cmd|exe)",
        "command": "${rPath}",
        "exceptions": [{
            "globs": "*.watcher.@(bat|cmd)",
            "command": "@out ${rPath}"
        }]
    }, {
        "globs": "**/@(src|test)/**/*.ts",
        "command": "node ${`out/${dir}/${sFile}.js`}",
        "exceptions": [{
            "globs": "*.spec.ts",
            "command": "@in mocha ${file.replace(/(\\/(?:src|test)\\/)/, '/out$1').replace(/ts$/, 'js')}"
        }]
    }]
}]
```

以下是上面示例配置项的描述。

#### 1.1 [globs][globs]

用于匹配文件路径的简单样式字符串。

**注意:** 你需要使用 `\\` 而不是 `\` 来 _转义_ Globs 中的特殊字符。

#### 1.2 命令（command）

你右键选择“Run As ...”菜单项后，用于在终端中运行的命令，你选中的文件将作为参数。

**1.2.1 命令模板**

- 一个通用的命令，如：`"node ${rPath}"`
- 或者是平台到命令的映射，如：`{ "win32": "start ${rPath}", "linux": "see ${rPath}", "darwin": "open ${rPath}" }`.

**1.2.2 命令参数: 路径**

一段 Javascript 代码片段，它看起来像这样 `${/* javascript */}`。它可以是： 

1. 一个 **变量**，如：`${rPath}`
2. 一个 **模板字符串**，如：`` ${`out/${dir}/${sFile}.js`} ``
    - 参见：[表格：变量含义](#table-variable-meaning)
3. 一个 **Javascript 代码片段**，如：`${file.replace(/(\\/(?:src|test)\\/)/, '/out$1').replace(/ts$/, 'js')}`，这段代码配置了右键运行 *.ts 文件时，实际上运行 out 目录下对应的 *.js 文件。（用第 2 种方法更简便）
    - **注意:** 你需要使用 `\\` 而不是 `\` 来 _转义_ 正则表达式中的特殊字符。

**1.2.3 命令前缀：`@in`，`@out`**

如果你想不管配置项 `"RunAs.runInNewTerminalWindows.enable"` 是什么，都（不）在新的外部终端窗口对某类文件用某条命令执行。你可以在命令开头使用前缀 `@in`，`@out`。

#### 1.3 例外（exceptions）

一个 globs 到命令的映射，如果文件路径匹配到 "exceptions" 中的样式字符串（globs），那么就会执行这个样式字符串对应的命令，而不是它父节点的命令。

#### Table: Variable Meaning
| 变量     | 含义                                             | 例子                                       |
| -------- | ------------------------------------------------ | ----------------------------------------- |
| `file`    | 你右键选中的文件的完整的路径                       | `D:\projects\project\src\common\module.ts` |
| `root`    | 项目的根目录                                      | `D:\projects\project`                      |
| `rPath`   | 文件对于 `root` 相对路径                           | `src\common\module.ts`                     |
| `dir`     | 文件的目录对于 `root` 相对路径                      | `src\common`                               |
| `lFile`   | 带扩展名的文件名                                  | `module.ts`                                |
| `sFile`   | 不带扩展名的文件名                                | `module`                                   |
| `ext`     | 文件的扩展名                                      | `ts`                                       |

### 2. 在外部终端中运行你的命令

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

在配置项 `"RunAs.runInNewTerminalWindows.commands"` 的平台到命令的映射中，
- 映射的键为，在 VSCode 中各平台的字符串：
    - Windows: `"win32"`,
    - Linux: `"linux"`
    - Mac OS: `"darwin"`
- 映射的值为，在对应的平台中，在终端执行并打开一个新的外部终端执行一条命令的命令，如：`"start ${command}"`
    - `${command}` 将会被替换为在 globs 到命令的映射中的命令。

你可以将配置项 `"RunAs.runInNewTerminalWindows.enable"` 设置为 `true`，这样默认在新的外部终端运行你的命令；你也可以使用前缀 `@out` 单独应用于特定类型的文件。

## 安装

在 VSCode 按下 `F1`，输入 `ext install` 打开插件市场，然后搜索 `"Run as ..."`。

## 已知问题

- 我不知道怎么在 Mac OS 中，在终端执行并打开一个新的外部终端执行一条命令。如果你知道，你可以自己配置。

## 提交问题

如果你发现任何 Bug，或者有其他相关问题，可以提交 [问题][issues]。

## 贡献

从 [仓库][repository] 派生并提交拉取请求（pull requests）。

## 关于

作者：plylrnsdy

Github：[vscode-run-as][repository]



[globs]:https://github.com/isaacs/node-glob
[issues]:https://github.com/plylrnsdy/vscode-run-as/issues
[repository]:https://github.com/plylrnsdy/vscode-run-as