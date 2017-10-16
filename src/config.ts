import * as minimatch from 'minimatch'
import CommonConfig from './common/Config'

type globsToCommandMap = {
    name?: string,
    enable?: boolean,
    globs?: string,
    command: string | { [platform: string]: string },
    exceptions?: globsToCommandMap[]
}

const MINIMATCH_OPTION = {
    matchBase: true
}

export default class Config extends CommonConfig {

    private maps: globsToCommandMap[]
    public newWindowConfig: globsToCommandMap

    constructor(private platform) {
        super('RunAs')
        this.onLoaded((configs) => {
            this.maps = this.get('globsMapToCommand')
            let fullNewWindowConfig = this.get('runInNewTerminalWindows')
            this.newWindowConfig = {
                enable: fullNewWindowConfig.enable,
                command: this.getCommand(fullNewWindowConfig)
            }
        })
    }

    getCommandByFile(file: string) {
        let map = this.searchMap(file, this.maps)
        return this.getCommand(map)
    }

    private searchMap(file: string, types: globsToCommandMap[]): globsToCommandMap {
        let match: globsToCommandMap,
            match2: globsToCommandMap

        for (let type of types)
            // FIXED: {matchBase: true}
            if (minimatch(file, type.globs, MINIMATCH_OPTION)) {
                match = type
                match2 = type.exceptions ? this.searchMap(file, type.exceptions) : null
                break
            }
        return match2 || match
    }

    private getCommand(map: globsToCommandMap): string {
        let { command } = map

        if (typeof command === 'string')
            return command
        else
            if (command[this.platform])
                return command[this.platform]
            else
                throw Error(`No command to execute to run file matched globs: " ${map.globs || map.name} " in your platform.`)
    }
}