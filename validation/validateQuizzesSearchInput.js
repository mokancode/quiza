const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateQuizzesSearchInput(data) {
    let errors = {};

    data.courseTitle = !isEmpty(data.courseTitle) ? data.courseTitle : '';
    data.courseCodeLetters = !isEmpty(data.courseCodeLetters) ? data.courseCodeLetters : '';
    data.courseCodeDigits = !isEmpty(data.courseCodeDigits) ? data.courseCodeDigits : '';

    if (!Validator.isLength(data.courseTitle, { min: 0, max: 50 })) {
        errors.courseTitle = "Title must be no longer than 50 characters";
    }

    // var letterRegex = new RegExp('[A-Za-z]', 'ig');
    // var digitRegex = new RegExp('[0-9]', 'ig');

    // if (data.courseCodeLetters.match(digitRegex)) {
    if (!isEmpty(data.courseCodeLetters) && data.courseCodeLetters.match(/[^A-z]/ig)) {
        console.log('wtf');
        errors.courseCodeLetters = "Letters only";
    }
    // if (data.courseCodeDigits.match(letterRegex)) {
    if (!isEmpty(data.courseCodeDigits) && data.courseCodeDigits.match(/[^0-9]/ig)) {
        errors.courseCodeDigits = "Digits only";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}