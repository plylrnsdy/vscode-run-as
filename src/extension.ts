import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import * as message from './common/message'
import Config from './Config'
import Terminal from './common/Terminal'
import Runner from './Runner'

let settingPath = path.join(__dirname, '../../package.json')
let setting = JSON.parse(fs.readFileSync(settingPath, 'utf8'))
if (setting.fristRun) {
    message.show('[Run As] If you has config this extension configuration, you need to modify the user configuration to make sure it work correctly.')
    setting.fristRun = false
    fs.writeFileSync(settingPath, JSON.stringify(setting))
}

export function activate(context: vscode.ExtensionContext) {

    let runner = new Runner(new Config(process.platform), new Terminal('Run As ...'), message)

    let disposable = vscode.commands.registerCommand('extension.runas', e => {
        if (e.fsPath)
            runner.run(e.fsPath)
    })

    context.subscriptions.push(disposable)
}

export function deactivate() { }