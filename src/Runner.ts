import Command from './Command'

export default class Runner {

    constructor(private config, private terminal, private message) {

    }

    run(filePath: string): void {
        try {
            let commandExpression = this.config.getCommandMapByFile(filePath),
                command = new Command(commandExpression, filePath, this.config.newWindowConfig)

            this.terminal.exec(command.toString())
        } catch (e) {
            // only catch every time running error
            this.message.error(e.message)
        }
    }
}