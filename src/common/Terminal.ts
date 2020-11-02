import * as vscode from 'vscode';

const { createTerminal } = vscode.window;
const { getConfiguration } = vscode.workspace;

const OS_NAME = {
    win32: 'windows',
    linux: 'linux',
    darwin: 'osx',
}
const DEFAULT_SHELL = {
    win32: 'C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    linux: '/bin/bash',
    darwin: '/bin/bash',
}

export interface TerminalOption {
    _filename?: string;
    _cd?: string;
    cwd?: string;
}

export class Terminal {

    private _shellPath?: string;

    private _terminal: vscode.Terminal;
    /**
     * VSCode inner Terminal current working directory
     * @memberof Terminal
     */
    private _cwd: string;

    /**
     * Construct a VSCode inner Terminal named ${name}.
     * @param {string} name 
     * @memberof Terminal
     */
    constructor(private name: string) { }

    init(): void {
        this._terminal = createTerminal(this.name, this._shellPath);
    }

    close(): void {
        this._terminal = null;
        this._cwd = null;
    }

    show() {
        if (this._terminal == null) {
            this.init();
        }
        this._terminal.show(false);
        return this;
    }

    /**
     * Execute ${command} in VSCode inner Terminal.
     * @param {string} command 
     * @returns {Terminal} 
     * @memberof Terminal
     */
    exec(command: string, { _cd, cwd }: TerminalOption = {}): Terminal {
        if (this._terminal == null) {
            this.init();
        }
        if (cwd && cwd !== this._cwd) {
            this._terminal.sendText(_cd);
            this._cwd = cwd;
        }
        if (command) {
            this._terminal.sendText(command);
        }
        return this;
    }

    equals(obj): boolean {
        return obj === this._terminal;
    }

    handleConfigLoad() {
        return () => {
            const userShellPath = getConfiguration('terminal').integrated.shell[OS_NAME[process.platform]]
            this._shellPath = userShellPath ? DEFAULT_SHELL[process.platform] : undefined

            if (this._terminal) {
                this._terminal.dispose()
            }
            this.init()
        }
    }
}