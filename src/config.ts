import * as minimatch from 'minimatch'
import CommonConfig from './common/Config'

type globsToCommandMap = { globs?: string, enable?: boolean, command: string | { [platform: string]: string }, exceptions?: globsToCommandMap[] }

const MINIMATCH_OPTION = {
    matchBase: true
}

let _platform

export default class Config extends CommonConfig {

    constructor(platform) {
        super('RunAs')
        _platform = platform
    }

    newWindowConfig() {
        let fullWhichConfig = this.get('runInNewTerminalWindows')

        return {
            enable: fullWhichConfig.enable,
            command: this.getCommand(fullWhichConfig)
        }
    }

    getCommandByFile(file: string) {
        let map = this.searchMap(file, this.get('globsMapToCommand'))

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
            if (command[_platform])
                return command[_platform]
            else
                throw Error(`No command to execute to run file matched globs: " ${map.globs} " in your platform.`)
    }
}