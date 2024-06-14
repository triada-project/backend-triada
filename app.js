require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const loggerStream = require('./src/utils/handleLogger');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const moment = require('moment');
const app = express();
const { resolve } = require('path');
const PORT = process.env.PORT || 5000;
const db = require('./src/helpers/db');
const env = require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const cron = require('node-cron');
const Events = require('./src/models/events.js');
const Users = require('./src/models/users.js');
const originMiddleware = require('./src/middlewares/originMiddleware.js');

const allowedOrigin = process.env.URL_ALLOW_ORIGIN;

db.connect();

app.use(cors());

// // Middleware de CORS
// app.use(
//   cors({
//     origin: allowedOrigin,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// );

// app.use(originMiddleware);

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

app.use(express.static(process.env.STATIC_DIR));

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(path);
});

// Configurar node-cron para que ejecute una tarea cada minuto
// cron.schedule('* * * * *', async () => {
//   const now = new Date();
//   const currentDate = now.toLocaleDateString('en-GB'); // Formato 'DD/MM/YYYY'
//   const currentHour = String(now.getHours()).padStart(2, '0');
//   const currentMinute = String(now.getMinutes()).padStart(2, '0');
//   const currentTime = `${currentHour}:${currentMinute}`; // Formato 'HH:MM'
//   console.log(currentDate, currentTime);

//   try {
//     const events = await Events.find({
//       status: 'aceptado',
//       date: currentDate,
//       startHour: { $lte: currentTime }, // Mayor o igual que la hora actual
//     });

//     for (const event of events) {
//       const [eventDay, eventMonth, eventYear] = event.date.split('/');
//       const [eventHour, eventMinute] = event.startHour.split(':');
//       const eventDate = new Date(
//         eventYear,
//         eventMonth - 1,
//         eventDay,
//         eventHour,
//         eventMinute,
//       );

//       if (now >= eventDate) {
//         event.status = 'en curso';
//         await event.save();
//         console.log(`Evento ${event._id} actualizado a "en curso".`);
//       }
//     }
//   } catch (error) {
//     console.error('Error actualizando eventos:', error);
//   }
// });

cron.schedule('0 * * * *', async () => {
  const now = moment();
  const currentDate = now.format('D/M/YYYY'); // Formato 'D/M/YYYY'
  const currentTime = now.format('HH:mm'); // Formato 'HH:mm'
  console.log(currentDate, currentTime);

  try {
    const events = await Events.find({
      status: 'aceptado',
      date: currentDate,
      startHour: { $lte: currentTime }, // startHour menor o igual a la hora actual
    });

    for (const event of events) {
      event.status = 'en curso';
      await event.save();
      console.log(`Evento ${event._id} actualizado a "en curso".`);
    }
  } catch (error) {
    console.error('Error actualizando eventos:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

module.exports = app;
