# Change log

## 1.7.1
* Fix can not run the file in root folder.

## 1.7.0
+ new variables to construct file path: `root`, `rPath`, `dir`, `lFile`, `sFile`, `ext`.

## 1.6.4
+ cache configuration before it change;
+ remind where is wrong;
+ support chinese;
+ new icon.

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