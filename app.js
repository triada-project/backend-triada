const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const app = express();
const { resolve } = require("path");
const port = 3005;
const payMentController = require('./src/controllers/paymentController.js');
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});


//import paymentRoutes from './src/routes/payment.routes.js'
//import { createSession } from './src/controllers/payment.controller.js';
// const payMentController = require('./src/controllers/paymentController.js');

// const stripe = require('stripe')('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ');
// const YOUR_DOMAIN = 'http://localhost:3005';

app.use(express.json());
//app.use(createSession)
app.use(cors());

app.use('/',routes);

//app.post('/create-checkout-session', payMentController.post)
//app.post('/create-payment-intent', payMentController.createPaymentIntent);

app.use(express.static(process.env.STATIC_DIR));

app.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});


app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});





app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 7050,
      automatic_payment_methods: { enabled: true },
      capture_method: "manual",
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});


const capturePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    console.log("Payment captured successfully:", paymentIntent);
    return paymentIntent;
  } catch (error) {
    console.error("Error capturing payment:", error);
    throw error;
  }
};


app.post("/capture-payment", async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const capturedPayment = await capturePayment(paymentIntentId);
    res.status(200).send({ message: "Payment captured successfully", payment: capturedPayment });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



app.get('/', (req, res) => {
  res.send('Hola desde express');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
