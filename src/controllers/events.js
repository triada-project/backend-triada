const Events = require('../models/events');
const Users = require('../models/users');
const twilio = require('twilio');
const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require('express-validator');
const { customAlphabet } = require('nanoid');
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

// function generarCodigoConfirmacion() {
//   return Math.random().toString(36).substr(2, 6).toUpperCase();
// }

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

    const message = `TRIADA - El código de confirmación para tu evento es ${codigoConfirmacion}. Compártelo al músico para finalizar el pago.`;

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
    console.error(error);
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

  getAllEventsMusician: async (req, res, next) => {
    const musicianId = req.params.musicianId; // Obtener el ID del músico de los parámetros de la solicitud
    try {
      let events = await Events.find({ musician: musicianId });
      next({ status: 200, send: { msg: 'Eventos encontrados', data: events } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Eventos no encontrados' } });
      handleHttpError(res, 'Eventos no encontrados', 404);
    }
  },

  getAllEventsClient: async (req, res, next) => {
    const clientId = req.params.clientId; // Obtener el ID del cliente de los parámetros de la solicitud
    try {
      let events = await Events.find({ client: clientId });
      next({ status: 200, send: { msg: 'Eventos encontrados', data: events } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Eventos no encontrados' } });
      handleHttpError(res, 'Eventos no encontrados', 404);
    }
  },

  post: async (req, res, next) => {
    //res.send({ data: 'metodo post events' });

    try {
      //const body = matchedData(req);
      const body = req.body;
      let events = await Events.create(body);
      const user = await Users.findById(body.musician);

      const msg = {
        to: user.email,
        from: 'Administracion@triada.rocks',
        subject: 'TRIADA: ¡Tienes una nueva solicitud de evento!',
        templateId: 'd-9087bbe003e642c9946de37c231ea9c7',
        dynamicTemplateData: {
          verify_url: `https://www.triada.rocks/`,
        },
      };
      await sgMail.send(msg);
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
      const codigoConfirmacion = nanoid();

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
      res.status(200).json({
        msg: 'Código de confirmación solicitado y enviado al cliente',
      });
    } catch (error) {
      // Maneja cualquier error y envía una respuesta adecuada
      console.error(error);
      res
        .status(500)
        .json({ msg: 'Error al solicitar y enviar el código de confirmación' });
    }
  },

  confirmarCodigoEvento: async (req, res, next) => {
    const { eventId } = req.params;
    const { codigoEvento } = req.body; // Se espera que el músico envíe el código del evento desde su dashboard

    try {
      // Busca el evento en la base de datos
      const evento = await Events.findById(eventId);

      // Verifica si el código del evento coincide con el código de confirmación almacenado en la base de datos
      if (evento.eventConfirmationCode === codigoEvento) {
        // Cambia el estado del evento a "iniciado"
        evento.status = 'finalizado';
        await evento.save();

        // Responde al músico con éxito
        res
          .status(200)
          .json({ msg: 'El evento ha sido iniciado correctamente' });
      } else {
        // Si el código no coincide, responde con un error
        res.status(400).json({ msg: 'El código de evento no es válido' });
      }
    } catch (error) {
      // Maneja cualquier error y envía una respuesta adecuada
      res.status(500).json({ msg: 'Error al confirmar el código de evento' });
    }
  },

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
      const event = await Events.findById(id);
      const userClient = await Users.findById(event.client);
      const userMusician = await Users.findById(event.musician);
      console.log(userClient);
      console.log(userMusician);
      // 1. Actualiza el evento y obtén el documento actualizado
      const updatedEvent = await Events.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedEvent.status === 'rechazado') {
        const msg = {
          to: userClient.email,
          from: 'Administracion@triada.rocks',
          subject: 'TRIADA - Evento no aceptado :(',
          templateId: 'd-4a4d8278dfe944b7bdfec926ecaf10c9',
          // dynamicTemplateData: {
          //   verify_url: `https://www.triada.rocks/`,
          // },
        };
        await sgMail.send(msg);
      } else if (updatedEvent.status === 'aceptado') {
        const msg = {
          to: userClient.email,
          from: 'Administracion@triada.rocks',
          subject: 'TRIADA - Evento aceptado :)',
          templateId: 'd-d8224d499a734199b3a0d64ebd99babe',
          dynamicTemplateData: {
            musico: userMusician.name,
          },
        };
        await sgMail.send(msg);
      }
      next({
        status: 200,
        send: { msg: 'Evento actualizado', data: updatedEvent },
      });
    } catch (error) {
      next({ status: 400, send: { msg: 'Evento no actualizado', err: error } });
      handleHttpError(res, 'Evento no actualizado', 404);
    }
  },
};
