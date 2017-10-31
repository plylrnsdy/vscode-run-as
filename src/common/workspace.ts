import * as vscode from 'vscode'

export function partitionPath(fsPath: string): string[] {
    fsPath = fsPath.replace(/\\/g, '\\\\')
    let root = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(fsPath)).uri.fsPath
    let relativePath = vscode.workspace.asRelativePath(fsPath, false)
    return [root, relativePath]
}