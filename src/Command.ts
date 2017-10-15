const VARIABLE = /\$\{([^}]+)\}/g

export default class Command {

    private isInOuterShell: boolean

    constructor(private command: string, private filePath: string, private newWindowConfig: { enable: boolean, command: string }) {
        this.handleFilePathWhiteSpace()
        this.handleWhetherNewWindow()
        this.handleVariables()
    }

    private handleFilePathWhiteSpace() {
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
        this.command = this.command.replace(/^@(out|in)\s/, (match, $switch) => {
            if ($switch === 'out') this.isInOuterShell = true
            else if ($switch === 'in') this.isInOuterShell = false
            return ''
        })
    }

    private handleVariables() {
        let [file, path, name, ext] = this.filePath.match(/^(.*)([^/]+)[.]([^.]+)$/)
        this.command = this.command.replace(VARIABLE, (match, script) => {
            let filePath = eval(script)
            return filePath
        })
    }

    toString(): string {
        let command = this.command
        if (this.isInOuterShell)
            return this.newWindowConfig.command.replace(VARIABLE, (match, script) => {
                return eval(script)
            })
        else
            return command
    }
}