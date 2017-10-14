import * as vscode from 'vscode'

export default class Config {

    constructor(private extNamespace: string) {

    }

    get(sections: string): any {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.'),
            configs: object = vscode.workspace.getConfiguration(this.extNamespace)

        for (let i = 0; i < _sections.length; i++)
            configs = configs[_sections[i]]

        return configs
    }
}