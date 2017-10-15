import * as vscode from 'vscode'

export default class Config {

    protected configs: object
    public loadedListeners: Array<(config: any) => void>

    constructor(private extNamespace: string) {
        this.loadedListeners = []
        this.loadNamespace()
    }

    reloadOnConfigChange() {
        return vscode.workspace.onDidChangeConfiguration((config) => {
            this.loadNamespace()
        })
    }

    protected loadNamespace() {
        this.configs = vscode.workspace.getConfiguration(this.extNamespace)

        for (let callback of this.loadedListeners)
            callback(this.configs)
    }

    onLoaded(callback: (config: any) => void) {
        this.loadedListeners.push(callback)
        // FIXED：loadNamespace() 后加入的 callback 在下次 DidChangeConfiguration 前没有被调用
        callback(this.configs)
    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.'),
            _configs = this.configs

        // FIXED: 使用了 this.configs 迭代取出变量，而不是局部变量
        for (let i = 0; i < _sections.length; i++)
            _configs = _configs[_sections[i]]

        return _configs
    }
}