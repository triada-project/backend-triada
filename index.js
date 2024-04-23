const express = require('express');
const routes = require('./src/routes/index.js');
const app = express();
const port = 3005;
const payMentController = require('./src/controllers/paymentController.js');


//import paymentRoutes from './src/routes/payment.routes.js'
//import { createSession } from './src/controllers/payment.controller.js';
// const payMentController = require('./src/controllers/paymentController.js');

// const stripe = require('stripe')('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ');
// const YOUR_DOMAIN = 'http://localhost:3005';

app.use(express.json());
//app.use(createSession)
app.use('/',routes);

app.post('/create-checkout-session', payMentController.post)



app.get('/', (req, res) => {
  res.send('Hola desde express');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
