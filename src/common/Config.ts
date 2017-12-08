import * as vscode from 'vscode'

const getConfiguration = vscode.workspace.getConfiguration

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

    loadNamespace(): void {
        // load configuration with top namespace
        this.configs = getConfiguration(this.extNamespace)
        // emit event 'load'
        for (let callback of this.loadedListeners)
            callback(this.configs)
    }

    onDidLoad(callback: (config: Config) => void): void {
        this.loadedListeners.push(callback)
        callback(this)
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.'),
            _length = _sections.length,
            _configs = this.configs

        for (let i = 0; i < _length; i++)
            _configs = _configs[_sections[i]]

        return _configs
    }
}