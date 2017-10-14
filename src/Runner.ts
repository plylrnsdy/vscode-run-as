import Command from './Command'

let _config,
    _terminal,
    _message

export default class Runner {

    constructor(config, terminal, message) {
        _config = config
        _terminal = terminal
        _message = message
    }

    run(filePath: string): void {
        try {
            /**
             * 命令行中路径中的空格字符串化（使用双引号包围）
             * 
             * win32: /Program" "Files/
             * linus: /Program" "Files/ or /Program' 'Files/
             * darwin: /Program" "Files/ or /Program' 'Files/ or /Program\ Files/
             */
            let file: string = filePath.replace(/(\s+)/g, '"$1"').replace(/\\/g, '/'),
                commandExpression = _config.getCommandByFile(file),
                command = new Command(commandExpression, file, _config.newWindowConfig())

            _terminal.exec(command.toString())
        } catch (e) {
            _message.error(e.message)
        }
    }
}