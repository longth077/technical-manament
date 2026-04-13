const { param, body } = require('express-validator');

const idParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
];

const requiredField = (fieldName, label) => {
  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${label || fieldName} is required`);
};

module.exports = { idParam, requiredField };
