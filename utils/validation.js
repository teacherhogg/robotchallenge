//
// http://localhost:3000/command?challenge=bigone&userid=dwhogg&userkey=9999&commands=FWD-1,BACK-2
//

let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

let validate = (required, query) => {
    let retval = {
        errors: null,
        data: {}
    };

    if (query) {
        for (let key in query) {
            if (!required.includes(key)) {
                if (!retval.errors) { retval.errors = {}; }
                if (!retval.errors.invalid) { retval.errors.invalid = []; }
                retval.errors.invalid.push(key);
            } else {
                retval.data[key] = query[key];

                if (key == 'commands') {
                    // Do additional checks!
                }
            }
        }
    }

    for (let param of required) {
        if (!retval.data[param] || !isRealString(retval.data[param])) {
            if (!retval.errors) { retval.errors = {}; }
            if (!retval.errors.missing) { retval.errors.missing = []; }
            retval.errors.missing.push(param);
        }
    }

    return retval;
}

let validateUser = (query) => {

    const required = ['username', 'usercode', 'challenge'];
    return validate(required, query);
}

let validateCommand = (query) => {

    const required = ['username', 'usercode', 'challenge', 'commands'];
    return validate(required, query);
}

module.exports = { validateCommand, validateUser };
