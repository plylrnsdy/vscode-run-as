const VARIABLE = /\$\{((?:\$\{.*\}|[^}])+)\}/g

let WORKSPACE, MESSAGE, I18N

class Command {

    private isInOuterShell: boolean

    constructor(
        private commandMap: { globs: string, command: string },
        private filePath: string,
        private newWindowConfig: { name: string, enable: boolean, command: string }
    ) {
        this.handleWhetherNewWindow()
        this.handleVariables()
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
        let file = this.escapeWhiteSpace(this.filePath)
        let [root, rPath] = WORKSPACE.partitionPath(this.filePath)
        root = this.escapeWhiteSpace(root)
        rPath = this.escapeWhiteSpace(rPath)
        let [, dir, lFile, sFile, ext] = rPath.match(/(.*?)[\/\\\\](([^\/\\\\]+?)\.(\w+))$/)
        this.commandMap.command = this.commandMap.command.replace(VARIABLE, (match, script) => {
            try {
                return eval(script)
            } catch (e) {
                MESSAGE.error(I18N.get('error.globsCommandWrong', this.commandMap.globs.replace(/\*/g, '\\*'), e.message))
            }
        })
    }

    private escapeWhiteSpace(fsPath: string): string {
        return fsPath.replace(/(\s+)/g, '"$1"')
    }

    toString(): string {
        let command = this.commandMap.command
        if (this.isInOuterShell)
            return this.newWindowConfig.command.replace(VARIABLE, (match, script) => {
                try {
                    return eval(script)
                } catch (e) {
                    MESSAGE.error(I18N.get('error.outerTerminalCommandWrong', this.newWindowConfig.name, e.message))
                }
            })
        else
            return command
    }
}

export default function init(workspace, message, i18n) {
    WORKSPACE = workspace
    MESSAGE = message
    I18N = i18n
    return Command
}