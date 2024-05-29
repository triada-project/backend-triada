const Users = require('../models/users');
const jwt = require('../helpers/jwt');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridApiKey);

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
      // Hashear la contraseña antes de guardar el usuario
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await Users.create({
        ...req.body,
        password: hashedPassword,
      });

      // Generar token de verificación (JWT o UUID)
      const verificationToken = jwt.create({ userId: user._id }); // O usar uuid
      user.verificationToken = verificationToken;
      await user.save();

      // Enviar correo con SendGrid
      const msg = {
        to: user.email,
        from: 'Administracion@triada.rocks',
        subject: 'Verifica tu correo electrónico',
        templateId: 'd-7596721b285940709a118c0a42f6f0d7',
        dynamicTemplateData: {
          verify_url: `http://18.119.160.6:4000/users/signup/email/verify?token=${verificationToken}&id=${user._id}`,
        },
      };
      await sgMail.send(msg);

      next({ status: 201, send: { msg: 'Usuario creado', data: { user } } });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no creado', err: error } });
    }
  },

  put: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
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
      next({ status: 201, send: { msg: 'Usuario eliminado' }, data: user });
    } catch (error) {
      next({ status: 400, send: { msg: 'Usuario no eliminado', data: error } });
    }
  },

  login: async (req, res, next) => {
    try {
      let user = await Users.findOne({ email: req.body.email });
      if (!user.emailVerified) {
        return next({ status: 400, send: { msg: 'Cuenta no validada' } });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next({ status: 401, send: { msg: 'Credenciales incorrectas' } });
      }
      let token = jwt.create(user);
      next({ status: 200, send: { msg: 'Acceso autorizado', token: token } });
    } catch (error) {
      next({ status: 401, send: { msg: 'Acceso no autorizado', err: error } });
    }
  },
  loginVerify: async (req, res, next) => {
    try {
      let user = await Users.findOne({ email: req.body.email });
      if (!user.emailVerified) {
        return next({ status: 400, send: { msg: 'Cuenta no validada' } });
      }
      if (user.password != req.body.password) {
        next({ status: 401, send: { msg: 'Credenciales incorrectas' } });
      }
      let token = jwt.create(user);
      next({ status: 200, send: { msg: 'Acceso autorizado', token: token } });
    } catch (error) {
      next({ status: 401, send: { msg: 'Acceso no autorizado', err: error } });
    }
  },

  verifyEmail: async (req, res, next) => {
    const { token, id } = req.query;

    try {
      // Busca el usuario en la base de datos
      const user = await Users.findById(id);

      if (!user) {
        return next({ status: 404, send: { msg: 'Usuario no encontrado' } });
      }

      if (user.verificationToken === token) {
        // Actualiza el estado de verificación del correo
        user.emailVerified = true;
        await user.save();

        // Obtén el rol del usuario
        const userRole = user.role;

        // Redirige según el rol
        if (userRole === 'musico') {
          res.redirect(`https://www.triada.rocks/stepper/${user._id}`);
        } else if (userRole === 'cliente') {
          res.redirect('https://www.triada.rocks/');
        } else {
          // Maneja roles inválidos
          res.status(400).send({ msg: 'Rol de usuario inválido' });
        }
      } else {
        next({ status: 400, send: { msg: 'Verificación de email fallida' } });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      next({
        status: 500,
        send: { msg: 'Error interno del servidor', err: error },
      });
    }
  },
};
