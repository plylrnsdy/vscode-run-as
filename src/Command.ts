import Path from './common/Path'
import * as mapper from './CommandMapper'
import { CommandMap, globsToCommandMap, nameToCommandMap } from './CommandMapper'


export default class Command {

    static cd(cwd:string, wd?: string){
        if (wd !== cwd)
            return Command.parseTemplate(mapper.changeCwd, (script) => { return eval(script) })
    }

    static run(filePath: Path): string {
        let map = mapper.getByFile(filePath.fsPath())
        // handle prefix: @in, @out
        let isInOuterShell = mapper.newWindow.enable
        map.command = (<string>map.command).replace(/^@(out|in)\s+/, (match, $switch) => {
            if ($switch === 'out') isInOuterShell = true
            else if ($switch === 'in') isInOuterShell = false
            return ''
        })
        // handle variables: ${`javascript`}
        map.command = Command.parseTemplate(map, (script) => {
            let [file, root, rPath, dir, lFile, sFile, ext] = filePath.partitions()
            return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)))
        })
        // handle command
        let command = map.command
        if (isInOuterShell)
            return Command.parseTemplate(mapper.newWindow, (script) => { return eval(script) })
        else
            return command
    }

    static parseTemplate(map: CommandMap, parser: (variable: string) => string): string {
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
}