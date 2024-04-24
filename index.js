const db = require('./src/helpers/db');
const express = require('express');
const userRouter = require('./src/routes/users');
const app = express();
const port = 3005;

db.connect();
app.use(express.json());

app.use('/user', userRouter);

app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
