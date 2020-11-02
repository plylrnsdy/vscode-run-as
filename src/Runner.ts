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

export default class Runner {

    message: Message = new Message(extensionName);
    i18n: i18nConstructor = new i18nConstructor('en', vscode.env.language, path.join(__dirname, '../../locale/lang.%s.json'));
    terminal: Terminal = new Terminal(extensionName);
    config: Config = new Config(extensionName.replace(' ', ''));
    commandMapper: CommandMapper = new CommandMapper();
    cmd: Command = new Command(this.commandMapper);
    modes: { [key: string]: (cmd: string, options: TerminalOption) => void }

    constructor() {
        let silent = (cmd, options) => this.terminal.exec(cmd, options)
        this.modes = {
            silent,
            in: (cmd, options) => this.terminal.show().exec(cmd, options),
            block: (cmd, options) => new Terminal(`${options._filename} [${extensionName}]`).show().exec(cmd, options),
            out: silent,
        }
        this.config.onDidLoad(this.terminal.handleConfigLoad());
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
        let partitions = fsPath.partitions();
        let root = partitions[1];

        let map = this.commandMapper.getMap(fsPath.fsPath());
        if (!map.exec) {
            if (map.mode === 'out') {
                map.command = this.cmd.start(map.command);
            }
            map.exec = this.modes[map.mode];
        }

        let cmd = this.cmd.format(map, partitions);
        let options = {
            _filename: partitions[5],
            _cd: this.cmd.cd(Path.wrapWhiteSpace(Path.normalize(root))),
            cwd: root,
        }
        map.exec(cmd, options);
    }

    handleConfigChanged() {
        return () => this.config.loadNamespace();
    }

    handleTerminalClosed() {
        return (closedTerminal: vscode.Terminal) => {
            if (this.terminal.equals(closedTerminal)) {
                this.terminal.close();
            }
        }
    }
}