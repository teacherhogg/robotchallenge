class Users {
    constructor() {
        this.users = [];
        this.suffix = '-d637911234';
    }
    addUser (data) {
        let id = data.username + "-" + data.usercode + this.suffix;
        let user = this.getUser(id);
        let reason = 'new';
        if (!user) {
            user = {
                id: id,
                challenge: data.challenge,
                username: data.username,
                usercode: data.usercode
            };
            this.users.push(user);
        } else {
            if (user.challenge == data.challenge) {
                // NO Change. NOT adding.
                reason = 'nochange';
            } else {
                reason = 'xchallenge';
                user.challenge = data.challenge;
            }
        }
        return {
            user: user,
            reason: reason
        }
    }
    removeUser (id) {
        var user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((userp) => userp.id !== id);
        }
        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0]
    }
    getUserList (challenge) {
        console.log("DA USER LIST is", this.users);
        var users = this.users.filter((user) => user.challenge === challenge);
        return users;
    }
}

module.exports = { Users };