import * as vscode from 'vscode'

const { createTerminal } = vscode.window

export default class Terminal {

    private _terminal: vscode.Terminal
    /**
     * VSCode inner Terminal current working directory
     * @memberof Terminal
     */
    cwd: string

    /**
     * Construct a VSCode inner Terminal named ${name}.
     * @param {string} name 
     * @memberof Terminal
     */
    constructor(private name: string) {
        this.init()
    }

    init(): void {
        this._terminal = createTerminal(this.name)
    }

    /**
     * Execute ${command} in VSCode inner Terminal.
     * @param {string} command 
     * @returns {Terminal} 
     * @memberof Terminal
     */
    exec(command: string): Terminal {
        if (command) {
            this._terminal.show(false)
            this._terminal.sendText(command)
        }
        return this
    }

    equals(obj): boolean {
        return obj === this._terminal
    }
}