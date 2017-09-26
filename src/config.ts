import * as vscode from 'vscode'

export default {

    /**
     * platform = 'win32' | 'linux' | 'darwin'
     */
    platform: process.platform,

    get(sections: string) {
        // Error: vscode.workspace.getConfiguration('simple.run.mapFilePatternToCommand') -> {}
        // Correct: vscode.workspace.getConfiguration('simple.run').mapFilePatternToCommand -> [...]
        let _sections: string[] = sections.split('.'),
            configs: object = vscode.workspace.getConfiguration(_sections[0])

        for (let i = 1; i < _sections.length; i++)
            configs = configs[_sections[i]]

        return configs
    }
}