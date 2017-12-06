import * as vscode from 'vscode'

let CONFIG, MESSAGE, I18N

class Terminal {

    private _terminal: vscode.Terminal
    private _cwd: string

    /**
     * Construct a VSCode inner Terminal named ${name}.
     * @param name 
     */
    constructor(private name) {
        this.init()
    }

    initOnClose() {
        return vscode.window.onDidCloseTerminal((closedTerminal) => {
            if (closedTerminal === this._terminal)
                this.init()
        })
    }

    private init(): void {
        this._terminal = vscode.window.createTerminal(this.name)
    }
    /**
     * Change VSCode inner Terminal current working directory if last cwd is different with ${cwd}.
     * @param {string} cwd 
     * @returns {Terminal} 
     * @memberof Terminal
     */
    cwd(cwd: string): Terminal {
        if (this._cwd !== cwd) {
            this._cwd = cwd
            this.exec(CONFIG.changeCwd.command.replace(/\$\{((?:\$\{.*\}|[^}])+)\}/g, (match, script) => {
                try {
                    return eval(script)
                } catch (e) {
                    MESSAGE.error(I18N.get('error.changeCwdCommandWrong', CONFIG.changCwd.name, e.message))
                }
            }))
        }
        return this
    }
    /**
     * Execute ${command} in VSCode inner Terminal.
     * @param {string} command 
     * @returns {Terminal} 
     * @memberof Terminal
     */
    exec(command: string): Terminal {
        this._terminal.show(false)
        this._terminal.sendText(command)
        return this
    }
}

export default function init(config, message, i18n) {
    CONFIG = config
    MESSAGE = message
    I18N = i18n
    return Terminal
}