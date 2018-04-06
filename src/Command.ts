import Path from './common/Path'
import * as mapper from './CommandMapper'
import { CommandMap, globsToCommandMap, nameToCommandMap } from './CommandMapper'


export function cd(cwd: string, wd?: string) {
    if (wd !== cwd)
        return parseTemplate(mapper.changeCwd, (script) => { return eval(script) })
}

export function run(filePath: Path): string {
    // find template command: run file
    let { globs, command } = mapper.getByFile(filePath.fsPath()),
        isInOuterShell = mapper.newWindow.enable
    // handle prefix: @in, @out
    command = (<string>command).replace(/^@(out|in)\s+/, (match, $switch) => {
        if ($switch === 'out') isInOuterShell = true
        else if ($switch === 'in') isInOuterShell = false
        return ''
    })
    // handle variables: ${`javascript`}
    command = parseTemplate({ globs, command }, (script) => {
        let [file, root, rPath, dir, lFile, sFile, ext] = filePath.partitions()
        return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)))
    })
    // handle template command: run in inner/outer terminal
    if (isInOuterShell)
        return parseTemplate(mapper.newWindow, (script) => { return eval(script) })
    else
        return command
}

export function parseTemplate(map: CommandMap, parser: (variable: string) => string): string {
    return (<string>map.command).replace(/\$\{((?:\$\{.*\}|[^}])+)\}/g, (match, script) => {
        try {
            return parser(script)
        } catch (e) {
            throw {
                type: 'error.commandParsedFail',
                commandId: (<globsToCommandMap>map).globs ? (<globsToCommandMap>map).globs : (<nameToCommandMap>map).name,
                message: e.message
            }
        }
    })
}