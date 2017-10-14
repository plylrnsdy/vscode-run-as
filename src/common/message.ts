import * as vscode from 'vscode'

export function show(message: string) {
    vscode.window.showInformationMessage(message)
}

export function error(message: string) {
    vscode.window.showErrorMessage(message)
}