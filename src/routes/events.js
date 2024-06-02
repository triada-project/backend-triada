const express = require('express');
const eventsRouter = express.Router();
const { validatorPostEvent } = require('../validators/events');
const eventController = require('../controllers/events');
const authenticateToken = require('../helpers/authenticateToken');

eventsRouter.get(
  '/:musicianId/events',
  authenticateToken,
  eventController.getAllEventsMusician,
);
eventsRouter.get(
  '/:clientId/eventsClient/',
  authenticateToken,
  eventController.getAllEventsClient,
);
eventsRouter.get('/:id', authenticateToken, eventController.getById);
//eventsRouter.post('/', validatorPostEvent, eventController.post);
eventsRouter.post('/', authenticateToken, eventController.post);
eventsRouter.put('/:id', authenticateToken, eventController.put);
eventsRouter.delete('/:id', authenticateToken, eventController.delete);
eventsRouter.post(
  '/:eventId/solicitar-codigo-confirmacion',
  authenticateToken,
  eventController.solicitarCodigoConfirmacion,
);
eventsRouter.post(
  '/:eventId/confirmar-codigo-evento',
  authenticateToken,
  eventController.confirmarCodigoEvento,
);

// eventsRouter.get('/', (req, res) => {
//   res.status(200).send('Hola desde events');
// });

module.exports = eventsRouter;
