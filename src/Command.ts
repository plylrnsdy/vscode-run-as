import Path from './common/Path'
import * as mapper from './CommandMapper'
import { CommandMap, globsToCommandMap, nameToCommandMap } from './CommandMapper'


export function cd(cwd: string, wd?: string) {
    if (wd !== cwd)
        return parseTemplate(mapper.changeCwd, (script) => { return eval(script) })
}

export function run(filePath: Path): string {
    let map = mapper.getByFile(filePath.fsPath()),
        command: string = <string>map.command,
        isInOuterShell = mapper.newWindow.enable
    // handle prefix: @in, @out
    command = command.replace(/^@(out|in)\s+/, (match, $switch) => {
        if ($switch === 'out') isInOuterShell = true
        else if ($switch === 'in') isInOuterShell = false
        return ''
    })
    // handle variables: ${`javascript`}
    command = parseTemplate(map, (script) => {
        let [file, root, rPath, dir, lFile, sFile, ext] = filePath.partitions()
        return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)))
    })
    // handle command
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
                commandId: (<globsToCommandMap>map).globs ? (<globsToCommandMap>map).globs.replace(/\*/g, '\\*') : (<nameToCommandMap>map).name,
                message: e.message
            }
        }
    })
}