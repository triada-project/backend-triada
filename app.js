require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const loggerStream = require('./src/utils/handleLogger');
const cors = require('cors');
const routes = require('./src/routes/index');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db');
const stripe = require('stripe')(
  // This is your test secret API key.
  'sk_test_51PF8FkP5DUIoEtib5wFs7y3NDalsSF5eErPf7azm2n2YmJNsImhupj2l5sypVAmvDlV68N4TV12XLFrbFOYYJMMT00Kof8BlR8',
  {
    apiVersion: '2023-10-16',
  },
);

db.connect();
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

morganBody(app, {
  noColors: true,
  stream: loggerStream,
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});

app.use('/', routes);

app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

app.post('/account_link', async (req, res) => {
  try {
    const { account } = req.body;

    const accountLink = await stripe.accountLinks.create({
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
    const account = await stripe.accounts.create({
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

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
