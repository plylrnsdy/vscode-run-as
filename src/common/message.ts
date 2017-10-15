import * as vscode from 'vscode'

export default class Message {

    private prefix: string

    /**
     * Creates an instance of Message.
     * @param {string} extensionName It will be place in the start of information, like `[extensionName] information`.
     * @memberof Message
     */
    constructor(extensionName: string) {
        this.prefix = `[${extensionName}] `
    }

    show(message: string) {
        vscode.window.showInformationMessage(this.prefix + message)
    }

    error(message: string) {
        vscode.window.showErrorMessage(this.prefix + message)
    }
}