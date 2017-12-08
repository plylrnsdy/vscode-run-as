import * as path from 'path'
import * as vscode from 'vscode'
import Message from './common/Message'
import i18nConstructor from "./util/i18n"
import Config from './common/Config'
import * as commandMap from './CommandMapper'
import Command from './Command'
import Terminal from './common/Terminal'
import Path from './common/Path'

const
    message = new Message('Run As'),
    i18n = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json')),
    terminal = new Terminal('Run As'),
    config = new Config('RunAs')

config.onLoaded(commandMap.load)

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(config.reloadOnConfigChange())
    context.subscriptions.push(terminal.initOnClose())
    context.subscriptions.push(vscode.commands.registerCommand('extension.runAs', e => {
        if (e.fsPath) {
            try {
                let fsPath = new Path(e.fsPath),
                    root = Path.wrapWhiteSpace(fsPath.root())
                terminal.exec(Command.cd(root, terminal.cwd)).exec(Command.run(fsPath))
                terminal.cwd = root
            } catch (e) {
                let msg = i18n.get(e.type, e)
                msg ? message.error(msg) : console.log(e)
            }
        }
    }))
}

export function deactivate() { }