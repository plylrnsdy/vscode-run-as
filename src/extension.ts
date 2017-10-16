import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import Config from './Config'
import Terminal from './common/Terminal'
import Command from './Command'

const dataPath = path.join(__dirname, '../../data.json')

let message = new Message('Run As')
let config = new Config(process.platform, message)
let terminal = new Terminal('Run As ...')

if (isFirstRun()) remindUpdateConfig()

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(config.reloadOnConfigChange())
    context.subscriptions.push(terminal.initOnClose())
    context.subscriptions.push(vscode.commands.registerCommand('extension.runas', e => {
        if (e.fsPath) {
            let commandExpression = config.getCommandMapByFile(e.fsPath),
                command = new Command(commandExpression, e.fsPath, config.newWindowConfig as any, message)
            terminal.exec(command.toString())
        }
    }))
}

export function deactivate() { }

function isFirstRun() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8')).isFirstRun
}

function remindUpdateConfig() {
    message.info('If you has config this extension configuration, you need to modify the user configuration to make sure it work correctly.')
    fs.writeFileSync(dataPath, JSON.stringify({ isFirstRun: false }))
}