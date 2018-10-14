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

    format(map: idToCommandMap, partitions: string[]) {
        // handle variables: ${`javascript`}
        return map.command.replace(/\$\{((?:\$\{.*\}|[^}])+)\}/g, (match, script) => {
            try {
                let [file, root, rPath, dir, lFile, sFile, ext] = partitions;
                return Path.wrapWhiteSpace(Path.normalize(eval(script)));
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