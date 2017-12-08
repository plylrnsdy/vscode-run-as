import * as minimatch from 'minimatch'


export type nameToCommandMap = {
    name: string,
    enable?: boolean,
    command: string | { [platform: string]: string }
}
export type globsToCommandMap = {
    globs: string,
    command: string | { [platform: string]: string },
    exceptions?: globsToCommandMap[]
}
export type CommandMap = nameToCommandMap | globsToCommandMap

export let changeCwd: nameToCommandMap
export let newWindow: nameToCommandMap
export let maps: globsToCommandMap[]

export function load(configs) {
    let fullChangeCwdConfig = configs.get('changeCwd'),
        fullNewWindowConfig = configs.get('runInNewTerminalWindows')

    changeCwd = {
        name: fullChangeCwdConfig.name,
        command: getCommand(fullChangeCwdConfig)
    }
    newWindow = {
        name: fullNewWindowConfig.name,
        enable: fullNewWindowConfig.enable,
        command: getCommand(fullNewWindowConfig)
    }
    maps = configs.get('globsMapToCommand')
}

export function getByFile(file: string):globsToCommandMap {
    let map = searchMap(file, maps)
    return {
        globs: map.globs,
        command: getCommand(map)
    }
}

const MINIMATCH_OPTION = { matchBase: true, dot: true }

function searchMap(file: string, types: globsToCommandMap[]): globsToCommandMap {
    let match: globsToCommandMap,
        match2: globsToCommandMap

    for (let type of types)
        if (minimatch(file, type.globs, MINIMATCH_OPTION)) {
            match = type
            match2 = type.exceptions ? searchMap(file, type.exceptions) : null
            break
        }
    return match2 || match
}

export function getCommand(map: CommandMap): string {
    if (typeof map.command === 'string')
        return map.command
    else
        if (map.command[process.platform])
            return map.command[process.platform]
        else
            throw {
                type: 'error.noCommandInThisPlatform',
                commandId: (<globsToCommandMap>map).globs ? (<globsToCommandMap>map).globs.replace(/\*/g, '\\*') : (<nameToCommandMap>map).name,
                message: 'No command in this platform.'
            }
}