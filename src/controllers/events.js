const Events = require('../models/events');
const twilio = require('twilio');
const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require('express-validator');

function generarCodigoConfirmacion() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

async function enviarCodigoPorSMS(
  eventId,
  telefonoCliente,
  codigoConfirmacion,
) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_NUMBER;

    const client = twilio(accountSid, authToken);

    const message = `Tu código de confirmación es ${codigoConfirmacion}`;

    await client.messages.create({
      body: message,
      from: twilioNumber,
      to: telefonoCliente,
    });

    console.log('Mensaje enviado con éxito.');

    // Opcionalmente, puedes guardar el registro del mensaje enviado en la base de datos
    // Esto puede ser útil para llevar un registro de los mensajes enviados
    // Por ejemplo:
    // await Events.findByIdAndUpdate(eventId, { $push: { smsLogs: { message, timestamp: Date.now() } } });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw new Error('Error al enviar mensaje');
  }
}

module.exports = {
  getById: async (req, res, next) => {
    const { id } = req.params;
    try {
      let events = await Events.findById(id);
      next({ status: 200, send: { msg: 'Evento encontrado', data: events } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Evento no encontrado' } });
      handleHttpError(res, 'Evento no encontrado', 404);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let events = await Events.find();
      next({ status: 200, send: { msg: 'Eventos encontrados', data: events } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Eventos no encontrados' } });
      handleHttpError(res, 'Eventos no encontrados', 404);
    }
  },

  post: async (req, res, next) => {
    //res.send({ data: 'metodo post events' });
    try {
      const body = matchedData(req);
      let events = await Events.create(body);
      next({ status: 201, send: { msg: 'Evento creado', data: { events } } });
    } catch (error) {
      //handleHttpError(res, 'Evento no creado', 404);
      next({ status: 400, send: { msg: 'Evento no creado' } });
    }
  },

  solicitarCodigoConfirmacion: async (req, res, next) => {
    const { eventId } = req.params;

    try {
      // Genera un nuevo código de confirmación
      const codigoConfirmacion = generarCodigoConfirmacion();

      // Actualiza el evento en la base de datos con el nuevo código de confirmación
      await Events.findByIdAndUpdate(eventId, {
        eventConfirmationCode: codigoConfirmacion,
      });

      // Encuentra el evento actualizado
      const eventoActualizado = await Events.findById(eventId);

      // Envía el código de confirmación al cliente por SMS
      await enviarCodigoPorSMS(
        eventId,
        eventoActualizado.phoneClient,
        codigoConfirmacion,
      );

      // Responde al cliente con éxito
      res
        .status(200)
        .json({
          msg: 'Código de confirmación solicitado y enviado al cliente',
        });
    } catch (error) {
      // Maneja cualquier error y envía una respuesta adecuada
      res
        .status(500)
        .json({ msg: 'Error al solicitar y enviar el código de confirmación' });
    }
  },

  // sendConfirmationCode: async (req, res, next) => {
  //   const { phone } = req.body;
  //   const accountSid = process.env.TWILIO_ACCOUNT_SID;
  //   const authToken = process.env.TWILIO_AUTH_TOKEN;
  //   const client = twilio(accountSid, authToken);

  //   try {
  //     const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  //     const message = `Tu código de confirmación es ${code}`;
  //     await client.messages.create({
  //       body: message,
  //       from: process.env.TWILIO_PHONE_NUMBER,
  //       to: phone,
  //     });
  //     next({
  //       status: 200,
  //       send: { msg: 'Código de confirmación enviado', data: code },
  //     });
  //   } catch (error) {
  //     next({ status: 400, send: { msg: 'Código de confirmación no enviado' } });
  //     handleHttpError(res, 'Código de confirmación no enviado', 404);
  //   }
  // },

  delete: async (req, res, next) => {
    const { id } = req.params;
    try {
      let events = await Events.findByIdAndDelete(id);
      next({ status: 200, send: { msg: 'Evento eliminado', data: events } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Evento no eliminado' } });
      handleHttpError(res, 'Evento no eliminado', 404);
    }
  },

  put: async (req, res, next) => {
    const { id } = req.params;
    try {
      let updatedEvents = await Events.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      next({
        status: 200,
        send: { msg: 'Evento actualizado', data: updatedEvents },
      });
    } catch (error) {
      next({ status: 400, send: { msg: 'Evento no actualizado', err: error } });
      handleHttpError(res, 'Evento no actualizado', 404);
    }
  },
};
