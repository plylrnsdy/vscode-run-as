import * as vscode from 'vscode'

export default class Message {

    /**
     * Creates an instance of Message.
     * @param {any} extensionName It will be place in the start of information, like `[extensionName] information`.
     * @memberof Message
     */
    constructor(private extensionName) {

    }

    show(message: string) {
        vscode.window.showInformationMessage(`[${this.extensionName}] ${message}`)
    }

    error(message: string) {
        vscode.window.showErrorMessage(`[${this.extensionName}] ${message}`)
    }
}