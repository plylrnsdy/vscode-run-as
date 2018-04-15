import * as vscode from 'vscode';

const { showInformationMessage, showWarningMessage, showErrorMessage } = vscode.window;

export default class Message {

    private prefix: string;

    /**
     * Creates an instance of Message.
     * @param {string} extensionName It will be place in the start of information, like `[extensionName] information`.
     * @memberof Message
     */
    constructor(extensionName: string) {
        this.prefix = `[${extensionName}] `;
    }

    info(message: string) {
        showInformationMessage(this.prefix + message);
    }

    warn(message: string) {
        showWarningMessage(this.prefix + message);
    }

    error(message: string) {
        showErrorMessage(this.prefix + message);
    }
}