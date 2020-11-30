//
// http://localhost:3000/command?challenge=bigone&userid=dwhogg&userkey=9999&commands=FWD-1,BACK-2
//

let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let validateCommand = (query) => {
    let retval = {
        errors: null,
        command: {}
    };

    const required = ['challenge', 'userid', 'userkey', 'commands']

    if (query) {
        for (let key in query) {
            if (!required.includes(key)) {
                if (!retval.errors) { retval.errors = {}; }
                if (!retval.errors.invalid) { retval.errors.invalid = []; }
                retval.errors.invalid.push(key);
            } else {
                retval.command[key] = query[key];

                if (key == 'commands') {
                    // Do additional checks!
                }
            }
        }
    }

    for (let param of required) {
        if (!retval.command[param] || !isRealString(retval.command[param])) {
            if (!retval.errors) { retval.errors = {}; }
            if (!retval.errors.missing) { retval.errors.missing = []; }
            retval.errors.missing.push(param);
        }
    }

    return retval;
}

module.exports = { validateCommand };
