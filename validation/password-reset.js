const { default: validator } = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePasswordResetInput(data) {
    let errors = {};

    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    
    if (validator.isEmpty(data.password)) {
        errors.password = 'Enter your password';
    }
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 and 30 characters, ' +
            'and must include lowercase and uppercase letters, digit(s), and a special character(s)';
    }
    else {
        var whatIsMissingFromPassword = [];
        if (!data.password.match(/[^A-z0-9_]/)) {
            whatIsMissingFromPassword.push("special character");
            // errors.password = "Password must include at least one special character";
        }
        if (!data.password.match(/[0-9]/)) {
            whatIsMissingFromPassword.push("digit");
            // errors.password = "Password must include at least one digit";
        }
        if (!data.password.match(/[A-Z]/)) {
            whatIsMissingFromPassword.push("uppercase letter");
            // errors.password = "Password must include at least one uppercase letter";
        }
        if (!data.password.match(/[a-z]/)) {
            whatIsMissingFromPassword.push("lowercase letter");
            // errors.password = "Password must include at least one lowercase letter";
        }

        if (whatIsMissingFromPassword.length > 0) {
            var whatIsMissingFromPasswordString = "Your password is missing at least ";
            for (var i = 0; i < whatIsMissingFromPassword.length; i++) {
                whatIsMissingFromPasswordString += `one ${whatIsMissingFromPassword[i]}`;
                if (i !== whatIsMissingFromPassword.length - 1) whatIsMissingFromPasswordString += ", ";
                if (i === whatIsMissingFromPassword.length - 2) whatIsMissingFromPasswordString += "and "
            }

            errors.password = whatIsMissingFromPasswordString;
        }
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Re-enter your password';
    } else if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}