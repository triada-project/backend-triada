require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const app = express();
const { resolve } = require("path");
const PORT = process.env.PORT || 5000;
const payMentController = require('./src/controllers/paymentController.js');
const db = require('./src/helpers/db');
const fileUpload = require('express-fileupload');
const env = require("dotenv").config({ path: "./.env" });
const mongoose = require('mongoose');
const Events = require('./src/models/events.js')


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

db.connect();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
);

app.use('/',routes);

app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

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
  const {eventFee,_id} = req.body;
  console.log('_id',_id);


  try {

    //8const event = await Events.findById(eventId);

    //console.log(event,'hola');

    // if (!event){
    //   return res.status(404).send({error:{message:'Evento no encontrado'}});
    // }


    const paymentIntent = await stripe.paymentIntents.create({
      currency: "MXN",
      amount: eventFee,
      automatic_payment_methods: { enabled: true },
      capture_method: "manual",
    });
    //res.redirect('http://localhost:3000');
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret
    });


    const event = await Events.findById(_id);
    console.log(event,'soy event');

    if(event){
      event.idStripePayment=paymentIntent.client_secret
      await event.save()
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

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);

});
