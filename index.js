const express = require('express');
const app = express();
const port = 3005;
const db = require('./src/helpers/db.js');

db.connect();

app.get('/', (req, res) => {
  res.send('Hola desde express');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
