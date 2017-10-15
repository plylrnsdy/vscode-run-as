import * as vscode from 'vscode'

export default class Config {

    private configs: object
    public loadedListeners: Array<(config: any) => void>

    constructor(private extNamespace: string) {
        this.load()
    }

    reloadOnConfigChange() {
        return vscode.workspace.onDidChangeConfiguration((config) => {
            this.load()
        })
    }

    private load() {
        this.configs = vscode.workspace.getConfiguration(this.extNamespace)

        for (let callback of this.loadedListeners)
            callback(this.configs)
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.')

        for (let i = 0; i < _sections.length; i++)
            this.configs = this.configs[_sections[i]]

        return this.configs
    }
}