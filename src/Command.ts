import Path from './common/Path'

const VARIABLE = /\$\{((?:\$\{.*\}|[^}])+)\}/g

let CONFIG, MESSAGE, I18N

class Command {

    private commandMap
    private isInOuterShell: boolean

    constructor(private filePath: Path) {
        this.commandMap = CONFIG.getCommandMapByFile(filePath.fsPath())
        this.handleWhetherNewWindow()
        this.handleVariables()
    }

    private handleWhetherNewWindow() {
        this.isInOuterShell = CONFIG.newWindow.enable
        this.commandMap.command = this.commandMap.command.replace(/^@(out|in)\s+/, (match, $switch) => {
            if ($switch === 'out') this.isInOuterShell = true
            else if ($switch === 'in') this.isInOuterShell = false
            return ''
        })
    }

    private handleVariables() {
        let [file, root, rPath, dir, lFile, sFile, ext] = this.filePath.partitions()
        this.commandMap.command = this.commandMap.command.replace(VARIABLE, (match, script) => {
            try {
                return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)))
            } catch (e) {
                MESSAGE.error(I18N.get('error.globsCommandWrong', this.commandMap.globs.replace(/\*/g, '\\*'), e.message))
            }
        })
    }

    toString(): string {
        let command = this.commandMap.command
        if (this.isInOuterShell)
            return CONFIG.newWindow.command.replace(VARIABLE, (match, script) => {
                try {
                    return eval(script)
                } catch (e) {
                    MESSAGE.error(I18N.get('error.outerTerminalCommandWrong', CONFIG.newWindow.name, e.message))
                }
            })
        else
            return command
    }
}

export default function init(config, message, i18n) {
    CONFIG = config
    MESSAGE = message
    I18N = i18n
    return Command
}