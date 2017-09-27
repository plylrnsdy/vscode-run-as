import * as vscode from 'vscode'
import config from './config'
import Runner from './Runner'
import Terminal from './Terminal'

// TODO: 国际化
// TODO: 使用 $ 表示在非打开新终端窗口模式中将该命令在新终端窗口中打开

export function activate(context: vscode.ExtensionContext) {

    let runner = new Runner(config, new Terminal('Run as ...'))

    let disposable = vscode.commands.registerCommand('extension.runas', e => {
            if (e.fsPath)
                runner.run(e.fsPath)
        })

    context.subscriptions.push(disposable)
}

export function deactivate() { }