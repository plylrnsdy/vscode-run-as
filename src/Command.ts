const VARIABLE = /\$\{([^}]+)\}/g

export default class Command {

    private isInOuterShell: boolean

    constructor(
        private commandMap: { globs: string, command: string },
        private filePath: string,
        private newWindowConfig: { name: string, enable: boolean, command: string },
        private message
    ) {
        this.handleFilePath()
        this.handleWhetherNewWindow()
        this.handleVariables()
    }

    private handleFilePath() {
        /**
          * 命令行中路径中的空格字符串化（使用双引号包围）
          * 
          * win32: /Program" "Files/
          * linus: /Program" "Files/ or /Program' 'Files/
          * darwin: /Program" "Files/ or /Program' 'Files/ or /Program\ Files/
          */
        this.filePath = this.filePath.replace(/(\s+)/g, '"$1"').replace(/\\/g, '/')
    }

    private handleWhetherNewWindow() {
        this.isInOuterShell = this.newWindowConfig.enable
        this.commandMap.command = this.commandMap.command.replace(/^@(out|in)\s/, (match, $switch) => {
            if ($switch === 'out') this.isInOuterShell = true
            else if ($switch === 'in') this.isInOuterShell = false
            return ''
        })
    }

    private handleVariables() {
        let file = this.filePath
        this.commandMap.command = this.commandMap.command.replace(VARIABLE, (match, script) => {
            let filePath
            try {
                filePath = eval(script)
            } catch (e) {
                this.message.error(`globs: ${this.commandMap.globs.replace(/\*/g, '\\*')} corresponding command is wrong: ${e.message}`)
            }
            return filePath
        })
    }

    toString(): string {
        let command = this.commandMap.command
        if (this.isInOuterShell)
            return this.newWindowConfig.command.replace(VARIABLE, (match, script) => {
                let subCommand
                try {
                    subCommand = eval(script)
                } catch (e) {
                    this.message.error(`"${this.newWindowConfig.name}" corresponding command is wrong: ${e.message}`)
                }
                return subCommand
            })
        else
            return command
    }
}