const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

const validatorPostEvent = [
  check('eventType').exists().notEmpty(),
  check('date').exists().notEmpty(),
  check('address').exists().notEmpty(),
  check('address.state').exists().notEmpty(),
  check('address.country').exists().notEmpty(),
  check('address.zipCode').exists().notEmpty(),
  check('address.city').exists().notEmpty(),
  check('address.street').exists().notEmpty(),
  check('address.exteriorNumber').exists().notEmpty(),
  check('address.neighborhood').exists().notEmpty(),
  check('status').exists().notEmpty(),
  check('eventConfirmationCode').exists().notEmpty(),
  check('idStripePayment').exists().notEmpty(),
  check('client').exists().notEmpty().isMongoId(),
  check('musician').exists().notEmpty().isMongoId(),
  (req, res, next) => {
    return validateResults(req, res, next);
  },
];

module.exports = { validatorPostEvent };
