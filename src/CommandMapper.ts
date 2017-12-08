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


const MINIMATCH_OPTION = { matchBase: true, dot: true },
    platform = process.platform

export let changeCwd: nameToCommandMap
export let newWindow: nameToCommandMap
export let maps: globsToCommandMap[]

export function load(configs) {
    changeCwd = configs.get('changeCwd')
    changeCwd.command = getCommand(changeCwd)
    newWindow = configs.get('runInNewTerminalWindows')
    newWindow.command = getCommand(newWindow)
    maps = configs.get('globsMapToCommand')
}

export function getByFile(file: string): globsToCommandMap {
    let map = searchMap(file, maps)

    map.command = getCommand(map)
    return map
}

function searchMap(file: string, types: globsToCommandMap[]): globsToCommandMap {
    let match: globsToCommandMap,
        match2: globsToCommandMap

    for (let type of types)
        if (minimatch(file, type.globs, MINIMATCH_OPTION)) {
            match = type
            match2 = type.exceptions ? searchMap(file, type.exceptions) : null
            return match2 || match
        }
}

export function getCommand(map: CommandMap): string {
    let command = map.command

    if (typeof command === 'string')
        return command
    else
        if (command[platform])
            return command[platform]
        else
            throw {
                type: 'error.noCommandInThisPlatform',
                commandId: (<globsToCommandMap>map).globs ? (<globsToCommandMap>map).globs.replace(/\*/g, '\\*') : (<nameToCommandMap>map).name,
                message: 'No command in this platform.'
            }
}