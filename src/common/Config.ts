import * as vscode from 'vscode';

const getConfiguration = vscode.workspace.getConfiguration;

export default class Config {

    protected configs: any
    protected loadedListeners: Array<(config: Config) => void> = []

    /**
     * Construct a Configuration with VSCode extension namespace.
     * @param extNamespace 
     */
    constructor(private extNamespace: string) {
        this.loadNamespace();
    }

    loadNamespace(): void {
        // load configuration with top namespace
        this.configs = JSON.parse(JSON.stringify(getConfiguration(this.extNamespace)));
        // emit event 'load'
        for (let callback of this.loadedListeners)
            callback(this);
    }

    onDidLoad(callback: (config: Config) => void): void {
        this.loadedListeners.push(callback);
        callback(this);
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _configs = this.configs,
            _sections: string[] = sections.split('.');

        for (let i = 0; i < _sections.length; i++)
            _configs = _configs[_sections[i]];

        return _configs;
    }
}