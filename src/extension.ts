import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import Config from './Config'
import Terminal from './common/Terminal'
import Runner from './Runner'

let message = new Message('Run As')

let settingPath = path.join(__dirname, '../../package.json')
let setting = JSON.parse(fs.readFileSync(settingPath, 'utf8'))
if (setting.firstRun) {
    message.show('If you has config this extension configuration, you need to modify the user configuration to make sure it work correctly.')
    setting.firstRun = false
    fs.writeFileSync(settingPath, JSON.stringify(setting))
}

export function activate(context: vscode.ExtensionContext) {

    let config = new Config(process.platform)

    context.subscriptions.push(config.reloadOnConfigChange())

    let terminal = new Terminal('Run As ...')

    context.subscriptions.push(terminal.initOnClose())

    let runner = new Runner(config, terminal, message)

    context.subscriptions.push(vscode.commands.registerCommand('extension.runas', e => {
        if (e.fsPath)
            runner.run(e.fsPath)
    }))
}

export function deactivate() { }