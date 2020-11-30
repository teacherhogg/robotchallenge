class Commands {
    constructor() {
        this.commands = [];
    }
    addCommand (command) {
        let id = Date.now();
        let newcommand = {
            id: id,
            challenge: command.challenge,
            userid: command.userid,
            userkey: command.userkey,
            commands: command.commands
        };
        this.commands.push(newcommand);
        return newcommand;
    }
    removeCommand (id) {
        var command = this.getCommand(id);

        if (command) {
            this.commands = this.command.filter((command) => command.id !== id);
        }

        return command;
    }
    getCommand (id) {
        return this.commands.filter((command) => command.id === id)[0]
    }
    getCommandList (challenge) {
        console.log("DA LIST is", this.commands);
        var commands = this.commands.filter((command) => command.challenge === challenge);
        return commands;
    }
}

module.exports = { Commands };