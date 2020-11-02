import * as micromatch from 'micromatch';
import { TerminalOption } from './common/Terminal';


interface Config {
    get(sections: string): any
}

type nameToCommandMap = {
    name: string,
    enable?: boolean,
    command: string | { [platform: string]: string }
};
type globsToCommandMap = {
    globs: string,
    terminal?: string,
    command: string | { [platform: string]: string },
    exceptions?: globsToCommandMap[]
};
type CommandMap = nameToCommandMap | globsToCommandMap;
export type idToCommandMap = {
    id: string,
    enable?: boolean,
    mode?: string;
    exec?: (cmd: string, options: TerminalOption) => void,
    command: string,
    exceptions?: idToCommandMap[]
};


const MATCH_OPTION = { matchBase: true, dot: true },
    platform = process.platform;

export class CommandMapper {

    changeCwd: idToCommandMap;
    newWindow: idToCommandMap;
    private maps: idToCommandMap[];

    handleConfigLoad() {
        return (configs: Config) => {
            this.changeCwd = this.formatMap(configs.get('changeCwd'));
            this.newWindow = this.formatMap(configs.get('runInNewTerminalWindows'));
            this.maps = this.formatMaps(configs.get('globsMapToCommand'));
        }
    }

    private formatMap(map: CommandMap): idToCommandMap {
        map['id'] = 'name' in map ? (map as nameToCommandMap).name : (map as globsToCommandMap).globs;
        map.command = typeof map.command === 'string'
            ? map.command
            : map.command[platform];

        return map as any as idToCommandMap;
    }

    private formatMaps(maps: CommandMap[]): idToCommandMap[] {
        for (const map of maps) {
            this.formatMap(map);
            if ('exceptions' in map) {
                this.formatMaps((map as globsToCommandMap).exceptions);
            }
        }
        return maps as any as idToCommandMap[];
    }

    getMap(path: string): idToCommandMap {
        const map = this.searchMap(path, this.maps);

        if (!map) throw {
            type: 'error.noConfiguration',
            path: path,
            message: 'No configuration for this type of path.'
        }
        if (!map.command) throw {
            type: 'error.noCommandInThisPlatform',
            commandId: map.id,
            message: 'No command in this platform.'
        }
        if (!map.mode) {
            map.mode = this.newWindow.enable ? 'out' : 'in';
            // handle prefix
            map.command = map.command.replace(/^@(\S+)\s+/, (match, $mode) => {
                map.mode = $mode;
                return '';
            });
        }

        return map;
    }

    private searchMap(path: string, types: idToCommandMap[]): idToCommandMap {
        let match: idToCommandMap,
            match2: idToCommandMap;

        for (let type of types) {
            if (micromatch.isMatch(path, type.id, MATCH_OPTION)) {
                match = type;
                match2 = type.exceptions && this.searchMap(path, type.exceptions);
                return match2 || match;
            }
        }
    }
}