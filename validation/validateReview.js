const Validator = require('validator');
const isEmpty = require('./is-empty');
const mTrim = require('./mTrim');

module.exports = function validateReview(data) {
    let errors = {};

    // data.reviewText = !isEmpty(data.reviewText) ? data.reviewText : "";

    if (data.operationType === "delete") {
        return {
            errors,
            data,
            isValid: isEmpty(errors)
        }
    }

    if (isEmpty(data.reviewText)) errors.review = "Review text is empty";

    else if (!Validator.isLength(data.reviewText, { min: 1, max: 500 })) errors.review = "Review must be between 1 and 500 characters";

    else if (!isEmpty(data.reviewText.match(new RegExp("(\n){5,}", "g")))) errors.review = "Spamming line-breaks is prohibited"

    return {
        errors,
        data,
        isValid: isEmpty(errors)
    }
}