require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db.js');
const router = require('./src/routes/index.js');

app.use(cors());

app.use(express.json());

app.use('/', router);

db.connect();

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hola desde express');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
