import * as PATH from 'path';
import * as vscode from 'vscode';

const { file } = vscode.Uri,
    { getWorkspaceFolder, asRelativePath } = vscode.workspace;

export default class Path {

    private _fsPath: string;
    private _root: string;
    private _relative: string;
    private _partitions: string[];

    constructor(fsPath: string) {
        this._fsPath = fsPath;
    }
    /**
     * Get file's absolute path.
     * @returns {string} file's absolute path
     * @memberof Path
     */
    fsPath(): string {
        return this._fsPath;
    }
    /**
     * Get file's workspace in vscode.
     * @returns {string} file's workspace in vscode
     * @memberof Path
     */
    root(): string {
        if (!this._root) {
            this._root = getWorkspaceFolder(file(this._fsPath)).uri.fsPath;
        }
        return this._root;
    }
    /**
     * Get file's relative path from workspace in vscode.
     * @returns {string} file's relative path from workspace
     * @memberof Path
     */
    asRelative(): string {
        if (!this._relative) {
            this._relative = asRelativePath(this._fsPath, false);
        }
        return this._relative;
    }
    /**
     * Get different partitions of file's relative path.
     * @returns [file, root, rPath, dir, lFile, sFile, ext]
     * @memberof Path
     */
    partitions(): string[] {
        if (!this._partitions) {
            let rPathPartitions = this.asRelative().match(/(.*?)[\/\\]{0,2}(([^\/\\]+?)\.(\w+))$/);
            this._partitions = [this.fsPath(), this.root(), ...rPathPartitions];
        }
        return this._partitions;
    }
    /**
     * Wrap the path with double quote, if the name include whitespace.
     * @static
     */
    static wrapWhiteSpace(path: string): string {
        return path.indexOf(' ') > -1 ? `"${path}"` : path;
    }
    static normalize(path: string): string {
        // if (process.platform === 'win32') {
        //     path = path.replace(/\\/g, '\\\\');
        // }
        return path.replace(/[\/\\]/g, PATH.sep);
    }
}