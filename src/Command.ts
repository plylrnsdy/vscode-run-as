import Path from './common/Path';
import { idToCommandMap, CommandMapper } from './CommandMapper';
import { format } from './util/formatter';


export default class Command {

    constructor(private mapper: CommandMapper) { }

    cd(cwd: string) {
        return format(this.mapper.changeCwd.command, { cwd });
    }

    start(command: string): string {
        return format(this.mapper.newWindow.command, { command });
    }

    format(map: idToCommandMap, fsPath: Path) {
        // handle prefix: @in, @out
        map.command = map.command.replace(/^@(out|in)\s+/, (match, $switch) => {
            map.terminal = $switch;
            return '';
        });
        // handle variables: ${`javascript`}
        return map.command.replace(/\$\{((?:\$\{.*\}|[^}])+)\}/g, (match, script) => {
            try {
                let [file, root, rPath, dir, lFile, sFile, ext] = fsPath.partitions();
                return Path.unifiedSeparator(Path.wrapWhiteSpace(eval(script)));
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