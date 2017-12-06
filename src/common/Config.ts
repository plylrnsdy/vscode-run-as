import * as vscode from 'vscode'

export default class Config {

    protected configs: object
    protected loadedListeners: Array<(config: any) => void> = []

    /**
     * Construct a Configuration with VSCode extension namespace.
     * @param extNamespace 
     */
    constructor(private extNamespace: string) {
        this.loadNamespace()
    }

    reloadOnConfigChange(): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration((config) => {
            this.loadNamespace()
        })
    }

    protected loadNamespace(): void {
        // load configuration with top namespace
        this.configs = vscode.workspace.getConfiguration(this.extNamespace)
        // emit event 'load'
        for (let callback of this.loadedListeners)
            callback(this.configs)
    }

    onLoaded(callback: (config: any) => void): void {
        this.loadedListeners.push(callback)
        callback(this.configs)
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.'),
            _configs = this.configs

        for (let i = 0; i < _sections.length; i++)
            _configs = _configs[_sections[i]]

        return _configs
    }
}