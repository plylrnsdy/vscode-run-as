import * as vscode from 'vscode';
import Runner from './Runner';

let runner: Runner,
    subscriptions: vscode.Disposable[];

export function activate(context: vscode.ExtensionContext) {

    runner = new Runner();
    subscriptions = [
        vscode.workspace.onDidChangeConfiguration(runner.handleConfigChanged()),
        vscode.window.onDidCloseTerminal(runner.handleTerminalClosed()),
        vscode.commands.registerCommand('extension.runAs', runner.handleCommandRun())
    ];

    context.subscriptions.push(...subscriptions);
}

export function deactivate() {
    subscriptions.forEach(disposable => disposable.dispose());
    runner = null;
}