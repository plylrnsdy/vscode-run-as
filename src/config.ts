import * as vscode from 'vscode'

export default {

    /**
     * platform = 'win32' | 'linux' | 'darwin'
     */
    platform: process.platform,

    get(sections: string) {
        // Error: vscode.workspace.getConfiguration('runas.globsMapToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('runas').run.globsMapToCommand -> globsToCommandMap[]
        let _sections: string[] = sections.split('.'),
            configs: object = vscode.workspace.getConfiguration(_sections[0])

        for (let i = 1; i < _sections.length; i++)
            configs = configs[_sections[i]]

        return configs
    }
}