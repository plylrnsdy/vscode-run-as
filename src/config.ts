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

let MESSAGE, I18N

class Config extends CommonConfig {

    private maps: globsToCommandMap[]
    public newWindowConfig: globsToCommandMap

    constructor(private platform) {
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
                MESSAGE.error(I18N.get('error.noCommandInThisPlatform', globs ? globs.replace(/\*/g, '\\*') : name))
    }
}

export default function init(message, i18n) {
    MESSAGE = message
    I18N = i18n
    return Config
}