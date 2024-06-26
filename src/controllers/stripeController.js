const Events = require('../models/events.js');
const Users = require('../models/users.js');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

const stripeConnect = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const capturePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    console.log('Payment captured successfully:', paymentIntent);
    return paymentIntent;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
};

module.exports = {
  createAccountLink: async (req, res, next) => {
    try {
      const { account } = req.body;

      const accountLink = await stripeConnect.accountLinks.create({
        account: account,
        return_url: `${req.headers.origin}/stepper/finalizar/${account}`,
        refresh_url: `${req.headers.origin}/stepper/refresh/${account}`,
        type: 'account_onboarding',
      });

      res.json(accountLink);
    } catch (error) {
      console.error(
        'An error occurred when calling the Stripe API to create an account link:',
        error,
      );
      res.status(500);
      res.send({ error: error.message });
    }
  },
  createAccount: async (req, res) => {
    try {
      const account = await stripeConnect.accounts.create({
        controller: {
          stripe_dashboard: {
            type: 'express',
          },
          fees: {
            payer: 'application',
          },
          losses: {
            payments: 'application',
          },
        },
      });

      res.json({
        account: account.id,
      });
    } catch (error) {
      console.error(
        'An error occurred when calling the Stripe API to create an account',
        error,
      );
      res.status(500);
      res.send({ error: error.message });
    }
  },
  getConfig: (req, res) => {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  },
  createPaymentIntent: async (req, res) => {
    const { eventFee, _id } = req.body;
    console.log('_id', _id);

    try {
      const event = await Events.findById(_id);
      const musicianData = await Users.findById(event.musician.toString());
      console.log(musicianData.id_stripe);
      // console.log(event, 'hola');

      // if (!event) {
      //   return res
      //     .status(404)
      //     .send({ error: { message: 'Evento no encontrado' } });
      // }

      const totalAmount = eventFee * 100;
      const triadaFee = (totalAmount * 0.1).toFixed(0);
      console.log(totalAmount);
      console.log(triadaFee);
      console.log(event.musician.toString());

      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'MXN',
        amount: totalAmount,
        automatic_payment_methods: { enabled: true },
        capture_method: 'manual',
        application_fee_amount: triadaFee,
        transfer_data: {
          destination: musicianData.id_stripe,
        },
      });
      //res.redirect('http://localhost:3000');
      // Send publishable key and PaymentIntent details to client
      res.send({
        clientSecret: paymentIntent.client_secret,
      });

      // const event = await Events.findById(_id);
      // console.log(event, 'soy event');

      if (event) {
        event.idStripePayment = paymentIntent.client_secret;
        await event.save();
      }
    } catch (e) {
      return res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  },
  capturePayment: async (req, res) => {
    const { paymentIntentId } = req.body;
    try {
      const capturedPayment = await capturePayment(paymentIntentId);
      res.status(200).send({
        message: 'Payment captured successfully',
        payment: capturedPayment,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
};
