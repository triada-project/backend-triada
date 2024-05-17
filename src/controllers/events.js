const Events = require('../models/events');
const { handleHttpError } = require('../utils/handleError');
const { matchedData } = require('express-validator');

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
