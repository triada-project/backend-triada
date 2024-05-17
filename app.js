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

// app.use((resp, req, res, next) => {
//   res.status(resp.status).send(resp.send);
// });

// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || 'Internal Server Error';
//   const error = err.name || 'Error';

// Enviar la respuesta con el código de estado válido
//   res.status(status).json({
//     success: false,
//     message,
//     error,
//   });
// });

// Middleware para manejar respuestas exitosas y errores pasados por next
app.use((result, req, res, next) => {
  if (result && result.status && result.send) {
    res.status(result.status).json(result.send);
  } else {
    next(result);
  }
});

// Middleware de manejo de errores no controlados
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const error = err.name || 'Error';

  res.status(status).json({
    success: false,
    message,
    error,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

module.exports = app;
