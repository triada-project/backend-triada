const express = require('express');
const router = express.Router();
const payMentController = require('../controllers/paymentController.js');
const authenticateToken = require('../helpers/authenticateToken');

//router.post('create-checkout-session', payMentController.post);
router.post(
  '/create-payment-intent',
  authenticateToken,
  payMentController.createPaymentIntent,
);
router.get('/success', (req, res) => res.redirect('/success.html'));
router.get('/cancel', (req, res) => res.redirect('/'));

module.exports = router;

/*
const express = require('express');
const routerExpress = express.Router();
//import {createSession} from '../controllers/payment.controller.js';
const payMentController = require('../controllers/paymentController.js');

const router = routerExpress;

router.post('/create-checkout-session',payMentController.post);
router.get('/success',(req,res) => res.redirect('/success.html'));
router.get('/cancel',(req,res) => res.redirect('/'));

module.exports = router;

*/
