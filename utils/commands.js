class Commands {
    constructor() {
        this.commands = [];
    }
    addCommand (user, challenge, commands) {
        let timestamp = Date.now();
        let newcommand = {
            id: user.id,
            challenge: challenge,
            timestamp: timestamp,
            commands: commands
        };
        this.commands.push(newcommand);
        return newcommand;
    }
    getCommandList (challenge) {
        console.log("DA LIST is", this.commands);
        var commands = this.commands.filter((command) => command.challenge === challenge);
        return commands;
    }
}

module.exports = { Commands };