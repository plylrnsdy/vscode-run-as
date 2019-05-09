# Change log

## 1.8.26
* Fix can not show panel when execute command which will block terminal

## 1.8.25
* Fix can not reopen after kill integrated terminal.

## 1.8.24
* Fix can not run file which path contain brackets.

## 1.8.23
* Fix can not close terminal "Run As" completely.

## 1.8.22
* `event-stream` package security update. [#event-steam](https://code.visualstudio.com/blogs/2018/11/26/event-stream)

## 1.8.21
* Fix can not changing `cwd` after killed integrated terminal.

## 1.8.20
* Correct the wrong of `README.md` and `CHANGELOG.md`;
+ Can set mode one time for commands on different platforms;
+ Add 2 modes: `silent` and `block` for running a command in integrated terminal.

## 1.8.18
* Fix cannot run the file which has white space in the first directory of path, like `some words/file.ext`.

## 1.8.17
- Remove gulp.

## 1.8.16
* Fix the link of the README for Simplified Chinese;
* Update `devDependencies`.

## 1.8.14
* Refactor the extension;
* Fix cannot run in Command Palette when open a document;
+ Add README for Simplified Chinese.

## 1.8.12
* Fix useless escape in notifications in vscode 1.21;
* Fix extglob cannot escape in globs;
* Fix did not work in vscode 1.22;
* Fix "Run As ..." item's position not correct on the right click menu.

## 1.8.8
* Fix configurations will not take effect before restarting vscode.

## 1.8.7
* Fix cannot use it after Killing Terminal of "Run as ...".

## 1.8.6
* Fix has not removed prefix from command when run in a new terminal window.

## 1.8.5
* Less useless code, more efficient.

## 1.8.4
* Fix cannot run the file if it is in the root and contains white space.

## 1.8.3
* less duplicated code;
* low module has less dependencies;
* new error handler to interrupt the program when having an error.

## 1.8.0
+ Auto change current working directory of vscode inner terminal in workspace(multi-directories mode).

## 1.7.2
* Fix cannot run the file if the path contains dot;
* Use icon.

## 1.7.1
* Fix cannot run the file in the root folder.

## 1.7.0
+ New variables to construct a file path: `root`, `rPath`, `dir`, `lFile`, `sFile`, `ext`.

## 1.6.4
+ Cache configuration before it change;
+ Remind where is wrong;
+ Support chinese;
+ New icon.

## 1.2.1
* `$0` replaced by `${command}`, `$1` replaced by `${file}`;
+ Javascript can be surrounded by `${` and `}` to execute;
+ Use `@out` an `@in` at the start of command to force to run in new terminal window or not;
+ Show error message when no command to execute in your platform;
* Use new powershell command to execute a command in a new terminal window in `win32`.

## 0.3.10
* Use TypeScript rewrite source code;
* Execute command in `TERMINAL` panel instead of `OUTPUT` channel;
* Fix cannot use it after killing terminal of "Run as ...";
* One globs can map to different command in different platform;
* Fix cannot open file with default application in a new terminal windows.

## 0.3.6
+ After configuration, different files which matched by globs have different command to execute it;
* Set terminal workspace to VSCode workspace;
+ After configuration, execute a command in a new terminal windows.

## 0.1.0
+ Right click javascript file and select "Run as javascript", to use node execute it;
+ Execute result output to `OUTPUT` channel.