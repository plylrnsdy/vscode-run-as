import * as vscode from 'vscode';

const { createTerminal } = vscode.window;

export interface TerminalOption {
    _cd: string;
    cwd: string;
}

export class Terminal {

    private _terminal: vscode.Terminal;
    /**
     * VSCode inner Terminal current working directory
     * @memberof Terminal
     */
    cwd: string;

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

    show() {
        this._terminal.show(false);
    }
    hide() {
        this._terminal.hide();
    }

    /**
     * Execute ${command} in VSCode inner Terminal.
     * @param {string} command 
     * @returns {Terminal} 
     * @memberof Terminal
     */
    exec(command: string, { _cd, cwd }: TerminalOption): Terminal {
        if (cwd !== this.cwd) {
            this._terminal.sendText(_cd);
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