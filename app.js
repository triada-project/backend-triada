require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const loggerStream = require('./src/utils/handleLogger');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const app = express();
const { resolve } = require('path');
const PORT = process.env.PORT || 5000;
const payMentController = require('./src/controllers/paymentController.js');
const db = require('./src/helpers/db');
const secretKeyStripe = process.env.STRIPE_SECRET_KEY;
const stripeConnect = require('stripe')(
  // This is your test secret API key.
  `${secretKeyStripe}`,
  {
    apiVersion: '2023-10-16',
  },
);
//const fileUpload = require('express-fileupload');
const env = require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Events = require('./src/models/events.js');
const Users = require('./src/models/users.js');
const originMiddleware = require('./src/helpers/originMiddleware');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

const allowedOrigin = process.env.URL_ALLOW_ORIGIN;

db.connect();

//app.use(cors());

// // Middleware de CORS
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(originMiddleware);

app.use(express.json());

app.use(morgan('dev'));

morganBody(app, {
  noColors: true,
  stream: loggerStream,
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: './uploads',
//   }),
// );

app.use('/', routes);

// app.use((resp, req, res, next) => {
//   res.status(resp.status).send(resp.send);
// });

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || 'Internal Server Error';
//   const error = err.name || 'Error';

// Enviar la respuesta con el código de estado válido
//   res.status(status).json({
//     success: false,
//     message,
//     error,
//   });
// });

// Middleware para manejar respuestas exitosas y errores pasados por next
app.use((result, req, res, next) => {
  if (result && result.status && result.send) {
    res.status(result.status).json(result.send);
  } else {
    next(result);
  }
});

// Middleware de manejo de errores no controlados
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const error = err.name || 'Error';

  res.status(status).json({
    success: false,
    message,
    error,
  });
});

app.post('/account_link', async (req, res) => {
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
});

app.post('/account', async (req, res) => {
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
});

app.use(express.static(process.env.STATIC_DIR));

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(path);
});

app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post('/create-payment-intent', async (req, res) => {
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
});

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "MXN",
//       amount: 7050,
//       automatic_payment_methods: { enabled: true },
//       capture_method: "manual",
//     });
//     //res.redirect('http://localhost:3000');
//     // Send publishable key and PaymentIntent details to client
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });

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

app.post('/capture-payment', async (req, res) => {
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
});

app.get('/', (req, res) => {
  res.send('Hola desde express');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

module.exports = app;
