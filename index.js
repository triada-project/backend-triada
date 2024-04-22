const db = require('./src/helpers/db');
const express = require('express');
const router = require('./src/routes');
const app = express();
const port = 3005;

db.connect();
app.use(express.json());

app.use('/', router);

// app.get('/', (req, res) => {
//   res.send('Hola desde express');
// });
app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
