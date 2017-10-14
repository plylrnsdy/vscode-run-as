import * as vscode from 'vscode'
import * as config from './config'

export default class Terminal {

    private name: string
    private terminal: vscode.Terminal

    constructor(name) {
        this.name = name
        this.init()
        // FIXED: 绑定事件监听只需一次
        vscode.window.onDidCloseTerminal((closedTerminal) => {
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