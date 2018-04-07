# Change log

## 1.8.12
* Fix useless escape in notifications in vscode 1.21;
* Fix extglob can not escape in globs;
* Fix did not work in vscode 1.22;
* Fix "Run As ..." item's position not correct in right click menu.

## 1.8.8
* Fix configurations will not take effect before restarting vscode.

## 1.8.7
* Fix can not use it after Kill Terminal of "Run as ...".

## 1.8.6
* Fix has not remove prefix from command when run in new terminal window.

## 1.8.5
* Less useless code, more efficiency.

## 1.8.4
* Fix can not run the file if it is in root and contains white space.

## 1.8.3
* less duplicated code;
* low module has less dependencies;
* new error handler to interrupt program when having an error.

## 1.8.0
+ Auto change current working directory of vscode inner terminal in workspace(multi-directories mode).

## 1.7.2
* Fix can not run the file if the path contains dot;
* Use icon.

## 1.7.1
* Fix can not run the file in root folder.

## 1.7.0
+ New variables to construct file path: `root`, `rPath`, `dir`, `lFile`, `sFile`, `ext`.

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
* Use new powershell command to execute command in new terminal window in `win32`.

## 0.3.10
* Use TypeScript rewrite source code;
* Execute command in `TERMINAL` panel instead of `OUTPUT` channel;
* Fix can not use it after kill terminal of "Run as ...";
* One globs can map to different command in different platform;
* Fix can not open file with default application in a new terminal windows.

## 0.3.6
+ After configuration, different files which matched by globs have different command to execute it;
* Set terminal workspace to VSCode workspace;
+ After configuration, execute command in a new terminal windows.

## 0.1.0
+ Right click javascript file and select "Run as javascript", to use node execute it;
+ Execute result output to `OUTPUT` channel.