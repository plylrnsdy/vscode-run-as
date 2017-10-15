import * as vscode from 'vscode'
import * as config from './config'

export default class Terminal {

    private terminal: vscode.Terminal

    constructor(private name) {
        this.init()
    }

    initOnClose() {
        return vscode.window.onDidCloseTerminal((closedTerminal) => {
            if (closedTerminal === this.terminal)
                this.init()
        })
    }

    private init(): void {
        this.terminal = vscode.window.createTerminal(this.name)
    }

    exec(command: string): void {
        this.terminal.show(false)
        this.terminal.sendText(command)
    }
}