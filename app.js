require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes/index');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db');

db.connect();
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/', routes);

app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
