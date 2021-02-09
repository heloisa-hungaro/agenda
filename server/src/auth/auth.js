'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-safe').config();

module.exports.verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar token.' });
    // if it works, save decoded id on request for further use
    req.userAuth = decoded.user_data; // login, super, perm_add, perm_edit, perm_del
    next();
  });
}

module.exports.newJWT = (user_data) => {
  return jwt.sign({user_data}, process.env.SECRET, {
        expiresIn: '1h'
      });
}