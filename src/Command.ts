import Path from './common/Path';
import { idToCommandMap, CommandMapper } from './CommandMapper';
import { format } from './util/formatter';


export default class Command {

    constructor(private mapper: CommandMapper) { }

    cd(cwd: string, wd?: string) {
        if (wd !== cwd)
            return format(this.mapper.changeCwd.command, { cwd });
    }

    run(filePath: Path): string {
        // find template command: run file
        let { id, command } = this.mapper.getMap(filePath.fsPath()),
            isInOuterShell = this.mapper.newWindow.enable;
        // handle prefix: @in, @out
        command = command.replace(/^@(out|in)\s+/, (match, $switch) => {
            if ($switch === 'out') isInOuterShell = true;
            else if ($switch === 'in') isInOuterShell = false;
            return '';
        });
        // handle variables: ${`javascript`}
        command = this.parseTemplate({ id, command }, (script) => {
            let [file, root, rPath, dir, lFile, sFile, ext] = filePath.partitions();
            return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)));
        })
        // handle template command: run in inner/outer terminal
        return isInOuterShell
            ? format(this.mapper.newWindow.command, { command })
            : command;
    }

    private parseTemplate(map: idToCommandMap, parser: (variable: string) => string): string {
        return map.command.replace(/\$\{((?:\$\{.*\}|[^}])+)\}/g, (match, script) => {
            try {
                return parser(script);
            } catch (e) {
                throw {
                    type: 'error.commandParsedFail',
                    commandId: map.id,
                    message: e.message
                }
            }
        });
    }
}