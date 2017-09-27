import * as minimatch from 'minimatch'

type globsToCommandMap = { globs: string, command: string | { [platform: string]: string }, exceptions?: globsToCommandMap[] }

export default class Runner {

    private config
    private terminal

    private minimatch_option: object = {
        matchBase: true
    }

    constructor(config, terminal) {
        this.config = config
        this.terminal = terminal
    }

    run(filePath: string): void {
        /**
         * 命令行中路径中的空格字符串化（使用双引号包围）
         * 
         * win32: /Program" "Files/
         * linus: /Program" "Files/ or /Program' 'Files/
         * darwin: /Program" "Files/ or /Program' 'Files/ or /Program\ Files/
         */
        let file: string = filePath.replace(/(\s)/g, '"$1"')

        let types: globsToCommandMap[] = this.config.get('RunAs.globsMapToCommand')
        let matchedType: globsToCommandMap = this.search(file, types)

        let enableNewShell: boolean = this.config.get('RunAs.runInNewTerminalWindows.enable')
        // TODO: 如果没有该平台下的命令，上方弹出提示
        let newShellCommand: string = this.config.get('RunAs.runInNewTerminalWindows.commands')[this.config.platform]

        // TODO: 如果没有该平台下的命令，上方弹出提示
        let commandExp0 = typeof matchedType.command === 'string' ? matchedType.command : matchedType.command[this.config.platform]
        let commandExp1: string = (enableNewShell ? newShellCommand.replace(/\$0/, commandExp0) : commandExp0)

        let command: string = file.replace(/^(.*)$/, commandExp1)
            // FIXED: 删除重复的命令调用。PowerShell 的行为和 Cmd 不同：命令 `start "" start "" <file>` 和 `start start <file>` 在 Cmd 中正确，而在 PowerShell 中错误。
            .replace(/^((\w+\s){2})/, '$2')

        this.terminal.exec(command)
    }

    private search(file: string, types: globsToCommandMap[]): globsToCommandMap {
        let match: globsToCommandMap, match2: globsToCommandMap
        for (let type of types)
            // FIXED: {matchBase: true}
            if (minimatch(file, type.globs, this.minimatch_option)) {
                match = type
                match2 = type.exceptions ? this.search(file, type.exceptions) : null
                break
            }
        return match2 || match
    }
}