const Users = require('../models/users');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let user = await Users.find(req.params);
      next({ status: 200, send: { msg: 'Usuarios', data: user } });
    } catch (error) {
      next({
        status: 404,
        send: { msg: 'Usuarios no encontrados', data: error },
      });
    }
  },

  getById: async (req, res, next) => {
    const { id } = req.params;
    try {
      let users = await Users.findById(id);
      next({
        status: 200,
        send: { msg: 'Usuario encontrado', data: users },
      });
    } catch (error) {
      next({ status: 404, send: { msg: 'Usuario no encontrado' } });
    }
  },
  post: async (req, res, next) => {
    try {
      let user = await Users.create(req.body);
      next({ status: 201, send: { msg: 'Usuario creado', data: { user } } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no creado', err: error } });
    }
  },
  put: async (req, res, next) => {
    try {
      const { id } = req.params;
      let user = await Users.findByIdAndUpdate(id, req.body);
      next({
        status: 201,
        send: { msg: 'Usuario actualizado', data: req.body },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: 'Usuario no actualizado', data: error },
      });
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      let user = await Users.findByIdAndDelete(id);
      next({ status: 201, send: { msg: 'Usuario eliminado' } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no eliminado', data: error } });
    }
  },
};
