//
// http://localhost:3000/command?challenge=bigone&userid=dwhogg&userkey=9999&commands=FWD-1,BACK-2
//

let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let validate = (required, allowed, query) => {
    let retval = {
        errors: null,
        data: {}
    };

    if (query) {
        for (let key in query) {
            if (!required.includes(key)) {
                if (!allowed.includes(key)) {
                    // This key is not in required NOR allowed. Error.
                    if (!retval.errors) {
                        retval.errors = {};
                    }
                    if (!retval.errors.invalid) {
                        retval.errors.invalid = [];
                    }
                    retval.errors.invalid.push(key);
                } else {
                    retval.data[key] = query[key];
                }
            } else {
                retval.data[key] = query[key];
            }
        }
    }

    for (let param of required) {
        if (!retval.data[param] || !isRealString(retval.data[param])) {
            if (!retval.errors) {
                retval.errors = {};
            }
            if (!retval.errors.missing) {
                retval.errors.missing = [];
            }
            retval.errors.missing.push(param);
        }
    }

    return retval;
}

let validateUser = (query) => {

    const required = ['username', 'usercode'];
    const allowed = ['random','challenge','group','firstname','lastname']
    return validate(required, allowed, query);
}

let validateCommand = (query) => {

    const required = ['username', 'usercode', 'commands'];
    const allowed = ['random', 'challenge', 'group','firstname','lastname'];
    return validate(required, allowed, query);
}

module.exports = {
    validateCommand,
    validateUser
};