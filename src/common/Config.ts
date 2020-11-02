import * as vscode from 'vscode';
import get from '../util/get';

const { getConfiguration } = vscode.workspace;

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
        for (const callback of this.loadedListeners) {
            callback(this);
        }
    }

    onDidLoad(callback: (config: Config) => void): void {
        this.loadedListeners.push(callback);
        callback(this);
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').globsMapToCommand -> globsToCommandMap[]

        return get(this.configs, sections)
    }
}