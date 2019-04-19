import * as vscode from 'vscode';

const { createTerminal } = vscode.window;

export interface TerminalOption {
    _filename?: string;
    _cd?: string;
    cwd?: string;
}

export class Terminal {

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
    constructor(private name: string) {
        this.init();
    }

    init(): void {
        this._terminal = createTerminal(this.name);
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
}