require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes/index');
const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db');
const fileUpload = require('express-fileupload');
const { uploadFile } = require('./src/helpers/s3');

db.connect();
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/', routes);

app.use((resp, req, res, next) => {
  res.status(resp.status).send(resp.send);
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads',
  }),
);

app.post('/files', async (req, res) => {
  const result = await uploadFile(req.files.file);
  res.json({ result });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to file upload API' });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
