import * as fs from "fs"
import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import i18nConstructor from "./util/i18n"
import initConfig from './Config'
import initCommand from './Command'
import initTerminal from './common/Terminal'
import Path from './common/Path'

let message = new Message('Run As')
let i18n = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'))
let config = new (initConfig(message, i18n))()
let Command = initCommand(config, message, i18n)
let terminal = new (initTerminal(config, message, i18n))('Run As')

export function activate(context: vscode.ExtensionContext) {
    try {
        context.subscriptions.push(config.reloadOnConfigChange())
        context.subscriptions.push(terminal.initOnClose())
        context.subscriptions.push(vscode.commands.registerCommand('extension.runAs', e => {
            if (e.fsPath) {
                let fsPath = new Path(e.fsPath)
                let command = new Command(fsPath)
                terminal.cwd(fsPath.root()).exec(command.toString())
            }
        }))
    } catch (e) {
        console.error(e)
    }
}

export function deactivate() { }