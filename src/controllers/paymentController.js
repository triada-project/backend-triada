const stripe = require('stripe')('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ');

const YOUR_DOMAIN = 'http://localhost:3005';

const createCheckoutSession = async (req, res) => {
    const session = await stripe.checkout.sessions.create({

      line_items: [

        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

          //price: 'price_1P8Rv9Doqexf69Wm1493LmQ8',
          price: 'price_1P8SLDDoqexf69WmDZmiIVQJ',
          quantity: 1,
        },
      ],
      //mode: 'payment',
      mode: 'subscription',
      //success_url: `${YOUR_DOMAIN}?success=true`,
      success_url: 'http://localhost:5000/stripeSuccess',
      //cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      cancel_url: 'http://localhost:5000/stripeCancel',
    });

    res.redirect(303, session.url);
};

module.exports = { post: createCheckoutSession };










/*

// This is your test secret API key.
const stripe = require('stripe')('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3005';
module.exports = {

  post: ('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: '{{PRICE_ID}}',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
  })
}

*/

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });

//app.listen(3005, () => console.log('Running on port 3005'));










/*
import Stripe from "stripe"

const stripe = new Stripe('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ')

export const createSession = async (req,res) => {
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    product_data:{
                        name: 'Laptop',
                        description: 'Gaming Laptop',
                    },
                    currency:'mxn',
                    unit_amount: '10000'
                },
                quantity: 1
            },
            {
                price_data:{
                    product_data:{
                        name: 'Laptop dos',
                        description: 'Gaming Laptop dos',
                    },
                    currency:'mxn',
                    unit_amount: '20000'
                },
                quantity:2
            }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'

    })

    return res.json(session)

}

*/










/*
const stripe = require('stripe')('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ');

async function createSession(req, res) {
  const YOUR_DOMAIN = 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: '10000', // Debes proporcionar el ID del precio correcto aquí
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    res.status(500).send("Error interno del servidor al crear la sesión de pago.");
  }
}

module.exports = {
  createSession
};

*/



















/*import Stripe from "stripe"

const stripe = new Stripe('sk_test_51P4oMODoqexf69WmNIX7SWam7twBN8OmN2QZBtEuGc5PQWqghVmzcU0V6fMyL13wMpwvGQtac9MiIGr8w9BV7bNx00iLyFehLZ')

export const createSession = async (req,res) => {
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    product_data:{
                        name: 'Laptop',
                        description: 'Gaming Laptop',
                    },
                    currency:'mxn',
                    unit_amount: '10000'
                },
                quantity: 1
            },
            {
                price_data:{
                    product_data:{
                        name: 'Laptop dos',
                        description: 'Gaming Laptop dos',
                    },
                    currency:'mxn',
                    unit_amount: '20000'
                },
                quantity:2
            }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'

    })

    return res.json(session)

}
*/
