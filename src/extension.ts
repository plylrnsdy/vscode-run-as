import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import i18nConstructor from "./util/i18n";
import Config from './Config'
import Terminal from './common/Terminal'
import Command from './Command'

const dataPath = path.join(__dirname, '../../data.json')

let message = new Message('Run As')
let i18n = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'))
let config = new Config(process.platform, message, i18n)
let terminal = new Terminal('Run As ...')

if (isFirstRun()) remindUpdateConfig()

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(config.reloadOnConfigChange())
    context.subscriptions.push(terminal.initOnClose())
    context.subscriptions.push(vscode.commands.registerCommand('extension.runAs', e => {
        if (e.fsPath) {
            let commandExpression = config.getCommandMapByFile(e.fsPath),
                command = new Command(commandExpression, e.fsPath, config.newWindowConfig as any, message, i18n)
            terminal.exec(command.toString())
        }
    }))
}

export function deactivate() { }

function isFirstRun() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8')).isFirstRun
}

function remindUpdateConfig() {
    message.info(i18n.get('info.firstRun'))
    fs.writeFileSync(dataPath, JSON.stringify({ isFirstRun: false }))
}