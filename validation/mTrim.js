// const Validator = require('validator');
// const isEmpty = require('./is-empty');

module.exports = function mTrim(str) {
    // let errors = {};
    return str.replace(/[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+/g, ' ');
}