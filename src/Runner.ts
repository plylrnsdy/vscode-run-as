import * as path from 'path';
import * as vscode from 'vscode';
import Message from './common/Message';
import i18nConstructor from './util/i18n';
import Config from './common/Config';
import { CommandMapper } from './CommandMapper';
import Command from './Command';
import { Terminal, TerminalOption } from './common/Terminal';
import Path from './common/Path';
import { format } from './util/formatter';


const extensionName = 'Run As';
let id = 1;

export default class Runner {

    message: Message = new Message(extensionName);
    i18n: i18nConstructor = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'));
    terminal: Terminal = new Terminal(extensionName);
    config: Config = new Config(extensionName.replace(' ', ''));
    commandMapper: CommandMapper = new CommandMapper();
    cmd: Command = new Command(this.commandMapper);
    terminals = {
        silent: { exec: (cmd, options) => this.terminal.exec(cmd, options) },
        in: { exec: (cmd, options) => { this.terminal.show(); this.terminal.exec(cmd, options); } },
        block: { exec: (cmd, options) => { this.terminal.show(); new Terminal(`${extensionName} ${id++}`).exec(cmd, options) } },
        out: { exec: (cmd, options) => this.terminal.exec(cmd, options) },
    } as { [key: string]: { exec: (cmd: string, options: TerminalOption) => void } }

    constructor() {
        this.config.onDidLoad(this.commandMapper.handleConfigLoad());
    }

    handleCommandRun() {
        return (event?) => {
            try {
                let editor = vscode.window.activeTextEditor;
                let path = event
                    ? event.fsPath
                    : editor && !editor.document.isUntitled
                        ? editor.document.fileName
                        : undefined;

                if (!path) throw { type: 'error.noFile', message: 'No file to run.' };

                this.run(path);
            } catch (error) {
                let msg = format(this.i18n.message(error.type), error);
                msg ? this.message.error(msg) : console.log(error);
            }
        }
    }

    run(path: string): void {
        let fsPath = new Path(path);
        let root = fsPath.root();
        let map = this.commandMapper.getMap(fsPath.fsPath());
        if (!map.terminal) {
            map.terminal = this.commandMapper.newWindow.enable ? 'out' : 'in';
        }
        if (typeof map.terminal === 'string') {
            if (map.terminal === 'out') {
                map.command = this.cmd.start(map.command);
            }
            map.terminal = this.terminals[map.terminal];
        }
        let cmd = this.cmd.format(map, fsPath);
        let options = {
            _cd: this.cmd.cd(Path.wrapWhiteSpace(root)),
            cwd: root,
        }
        console.log(cmd)
        map.terminal.exec(cmd, options);
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