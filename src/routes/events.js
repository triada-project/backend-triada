const express = require('express');
const eventsRouter = express.Router();
const { validatorPostEvent } = require('../validators/events');
const eventController = require('../controllers/events');

eventsRouter.get('/:musicianId/events', eventController.getAll);
eventsRouter.get('/:id', eventController.getById);
eventsRouter.post('/', validatorPostEvent, eventController.post);
eventsRouter.put('/:id', eventController.put);
eventsRouter.delete('/:id', eventController.delete);
eventsRouter.post(
  '/:eventId/solicitar-codigo-confirmacion',
  eventController.solicitarCodigoConfirmacion,
);
eventsRouter.post(
  '/:eventId/confirmar-codigo-evento',
  eventController.confirmarCodigoEvento,
);

// eventsRouter.get('/', (req, res) => {
//   res.status(200).send('Hola desde events');
// });

module.exports = eventsRouter;
