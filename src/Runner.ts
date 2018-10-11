import * as path from 'path';
import * as vscode from 'vscode';
import Message from './common/Message';
import i18nConstructor from './util/i18n';
import Config from './common/Config';
import { CommandMapper } from './CommandMapper';
import Command from './Command';
import Terminal from './common/Terminal';
import Path from './common/Path';
import { format } from './util/formatter';


export default class Runner {

    message: Message;
    i18n: i18nConstructor;
    terminal: Terminal;
    config: Config;
    commandMapper: CommandMapper;
    command: Command;

    constructor() {
        this.message = new Message('Run As');
        this.i18n = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'));
        this.terminal = new Terminal('Run As');
        this.config = new Config('RunAs');
        this.commandMapper = new CommandMapper();
        this.config.onDidLoad(this.commandMapper.handleConfigLoad());
        this.command = new Command(this.commandMapper);
    }

    handleCommandRun() {
        return (e?) => {
            try {
                let editor = vscode.window.activeTextEditor,
                    path = e
                        ? e.fsPath
                        : editor && !editor.document.isUntitled
                            ? editor.document.fileName
                            : undefined;

                if (!path) throw { type: 'error.noFile', message: 'No file to run.' };

                this.run(path);
            } catch (e) {
                let msg = format(this.i18n.message(e.type), e);
                msg ? this.message.error(msg) : console.log(e);
            }
        }
    }

    run(path: string): void {
        let fsPath = new Path(path),
            root = Path.wrapWhiteSpace(fsPath.root());
        this.terminal.exec(this.command.cd(root, this.terminal.cwd)).exec(this.command.run(fsPath));
        this.terminal.cwd = root;
    }

    handleConfigChanged() {
        return () => this.config.loadNamespace();
    }

    handleTerminalClosed() {
        return (closedTerminal: vscode.Terminal) => {
            if (this.terminal.equals(closedTerminal))
                this.terminal.init();
        }
    }
}