const stripe = require('stripe')(
  'sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ',
);

const createPaymentIntent = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    //amount: calculateOrderAmount(items),
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: token,
    capture: false,
    currency: 'mxn',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = { createPaymentIntent };
