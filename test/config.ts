type platformType = 'win32' | 'linux' | 'darwin'

export default class config {

    platform: platformType

    constructor(platform: platformType, isRunInNewTerminal: boolean) {
        this.platform = platform
        configs["RunAs.runInNewTerminalWindows.enable"] = isRunInNewTerminal
    }

    get(sections: string) {
        return configs[sections]
    }
}

let configs = {
    "RunAs.runInNewTerminalWindows.enable": false,
    "RunAs.runInNewTerminalWindows.commands": {
        "win32": "start $0",
        "linux": "gnome-terminal -x bash -c '$1'"
    },
    "RunAs.globsMapToCommand": [{
        "globs": "*.*",
        "command": {
            "win32": "start $1",
            "linux": "see $1",
            "darwin": "open $1"
        },
        "exceptions": [{
            "globs": "*.+(bat|cmd|exe)",
            "command": "$1"
        },
        {
            "globs": "*.js",
            "command": "node $1",
            "exceptions": [{
                "globs": "*.spec.js",
                "command": "mocha $1"
            }]
        }, {
            "globs": "*.sh",
            "command": "$1"
        }, {
            "globs": "*.py",
            "command": "python $1"
        }
        ]
    }]
}