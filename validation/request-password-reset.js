const { default: validator } = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRequestPasswordResetInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';

    if (!isEmpty(data.username) && !validator.isLength(data.username, { min: 5, max: 30 })) {
        errors.username = 'Username must be 5-30 characters long';
    } else if (!validator.isAlphanumeric(data.username)) {
        errors.username = 'Username may only include letters, digits and the underscore symbol'
    }

    if (!isEmpty(data.email) && !validator.isEmail(data.email)) {
        errors.email = 'Invalid email';
    }

    if (isEmpty(data.username) && isEmpty(data.email)) {
        errors.passwordResetRequest = "Must enter a username or email";
    }

    // valid username but invalid email
    else if (!isEmpty(data.username) && isEmpty(errors.username) && !isEmpty(errors.email)) { delete errors.email; }
    // valid email but invalid username 
    else if (!isEmpty(data.email) && isEmpty(errors.email) && !isEmpty(errors.username)) { delete errors.username; }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}