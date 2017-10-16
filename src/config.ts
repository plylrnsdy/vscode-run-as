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

    constructor(private platform, private message, private i18n) {
        super('RunAs')
        this.onLoaded((configs) => {
            this.maps = this.get('globsMapToCommand')
            let fullNewWindowConfig = this.get('runInNewTerminalWindows')
            this.newWindowConfig = {
                name: fullNewWindowConfig.name,
                enable: fullNewWindowConfig.enable,
                command: this.getCommand(fullNewWindowConfig)
            }
        })
    }

    getCommandMapByFile(file: string) {
        let map = this.searchMap(file, this.maps)
        return {
            globs: map.globs,
            command: this.getCommand(map)
        }
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

    private getCommand({ name, globs, command }: globsToCommandMap): string {

        if (typeof command === 'string')
            return command
        else
            if (command[this.platform])
                return command[this.platform]
            else
                this.message.error(this.i18n.get('error.noCommandInThisPlatform', globs ? globs.replace(/\*/g, '\\*') : name))
    }
}