const express = require('express');
const stripeRouter = express.Router();
const stripeController = require('../controllers/stripeController');

stripeRouter.post('/account_link', stripeController.createAccountLink);
stripeRouter.post('/account', stripeController.createAccount);
stripeRouter.get('/config', stripeController.getConfig);
stripeRouter.post(
  '/create-payment-intent',
  stripeController.createPaymentIntent,
);
stripeRouter.post('/capture-payment', stripeController.capturePayment);

module.exports = stripeRouter;
