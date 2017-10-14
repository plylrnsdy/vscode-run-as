const VARIABLE = /\$\{([^}]+)\}/g

export default class Command {

    private isInOuterShell

    constructor(private command: string, private filePath: string, private newWindowConfig: { enable: boolean, command: string }) {
        this.handleWhetherNewWindow()
        this.handleVariables()
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