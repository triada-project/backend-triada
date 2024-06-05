const express = require('express');
const eventsRouter = express.Router();
const eventController = require('../controllers/events');
const authenticateToken = require('../middlewares/authenticateToken');
const authenticateRoleClient = require('../middlewares/authenticateRoleClient');
const authenticateRoleMusician = require('../middlewares/authenticateRoleMusician');

eventsRouter.get(
  '/:musicianId/events',
  authenticateToken,
  authenticateRoleMusician,
  eventController.getAllEventsMusician,
);
eventsRouter.get(
  '/:clientId/eventsClient/',
  authenticateToken,
  authenticateRoleClient,
  eventController.getAllEventsClient,
);
eventsRouter.get('/:id', authenticateToken, eventController.getById);
eventsRouter.post(
  '/',
  authenticateToken,
  authenticateRoleClient,
  eventController.post,
);
eventsRouter.put('/:id', authenticateToken, eventController.put);
eventsRouter.delete('/:id', authenticateToken, eventController.delete);
eventsRouter.post(
  '/:eventId/solicitar-codigo-confirmacion',
  authenticateToken,
  authenticateRoleClient,
  eventController.solicitarCodigoConfirmacion,
);
eventsRouter.post(
  '/:eventId/confirmar-codigo-evento',
  authenticateToken,
  authenticateRoleMusician,
  eventController.confirmarCodigoEvento,
);

module.exports = eventsRouter;
