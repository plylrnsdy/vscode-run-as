import * as minimatch from 'minimatch'
import CommonConfig from './common/Config'

type nameToCommandMap = {
    name: string,
    enable?: boolean,
    command: string | { [platform: string]: string }
}
type globsToCommandMap = {
    globs: string,
    command: string | { [platform: string]: string },
    exceptions: globsToCommandMap[]
}
type CommandMap = nameToCommandMap | globsToCommandMap

let MESSAGE, I18N
const MINIMATCH_OPTION = {
    matchBase: true,
    dot: true
}

class Config extends CommonConfig {

    private maps: globsToCommandMap[]
    changeCwd: nameToCommandMap
    newWindow: nameToCommandMap

    constructor() {
        super('RunAs')
        this.onLoaded((configs) => {
            this.maps = this.get('globsMapToCommand')
            let fullChangeCwdConfig = this.get('changeCwd')
            this.changeCwd = {
                name: fullChangeCwdConfig.name,
                command: this.getCommand(fullChangeCwdConfig)
            }
            let fullNewWindowConfig = this.get('runInNewTerminalWindows')
            this.newWindow = {
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
            if (minimatch(file, type.globs, MINIMATCH_OPTION)) {
                match = type
                match2 = type.exceptions ? this.searchMap(file, type.exceptions) : null
                break
            }
        return match2 || match
    }

    private getCommand(map: CommandMap): string {
        if (typeof map.command === 'string')
            return map.command
        else
            if (map.command[process.platform])
                return map.command[process.platform]
            else
                MESSAGE.error(I18N.get('error.noCommandInThisPlatform',
                    (<globsToCommandMap>map).globs ? (<globsToCommandMap>map).globs.replace(/\*/g, '\\*') : (<nameToCommandMap>map).name))
    }
}

export default function init(message, i18n) {
    MESSAGE = message
    I18N = i18n
    return Config
}