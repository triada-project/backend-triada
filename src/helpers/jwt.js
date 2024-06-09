const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Users = require('../models/users');

module.exports = {
  create: (data) => {
    let token = jwt.sign(
      { _id: data._id, email: data.email, name: data.name, role: data.role },
      JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );
    return token;
  },

  //middleware
  verify: (req, res, next) => {
    const token = req.headers['bearerauth'];
    const dateNow = new Date();

    if (!token) {
      res.status(401).send({ msg: 'Usuario no autorizado' });
    }
    jwt.verify(token, JWT_SECRET, async (err, decode) => {
      //decode = payload decodificado
      if (err) res.status(401).send({ msg: 'Token Invalido' });
      if (decode.exp < dateNow.getTime() / 1000) {
        res.status(401).send({ msg: 'Sesión expirada' });
      }

      req.loginUser = await Users.findById(decode._id);
      next();
    });
  },
};
