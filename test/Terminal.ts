import * as shell from 'child_process'
import * as path from 'path'

export default class Terminal {

    workspace: string

    constructor(name) {
        this.workspace = __dirname.replace(/out\\/, '')
    }

    exec(command: string): void {
        console.log(this.workspace)
        shell.exec(command, { cwd: this.workspace }, (err, stdout, stderr) => {
            if (err)
                console.error(stderr)
            else
                console.log(stdout)
        })
    }
}