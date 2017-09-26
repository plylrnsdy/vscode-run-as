import * as vscode from 'vscode'
import config from './config'
import Runner from './Runner'
import Terminal from './Terminal'

export function activate(context: vscode.ExtensionContext) {

    let runner = new Runner(config, new Terminal('Run as ...'))

    let disposable = vscode.commands.registerCommand('extension.runas', e => {
            if (e.fsPath)
                runner.run(e.fsPath)
        })

    context.subscriptions.push(disposable)
}

export function deactivate() { }