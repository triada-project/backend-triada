require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// const port = 3005;
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db.js');

app.use(cors());

db.connect();

app.get('/', (req, res) => {
  res.send('Hola desde express');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
