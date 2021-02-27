'use strict';

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-safe').config();

module.exports.verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'Nenhum token fornecido.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ message: 'Falha ao autenticar token.' });
    // if it works, save decoded id on request for further use
    req.userAuth = decoded.userData; // id, super
    next();
  });
}

module.exports.newJWT = (userData) => {
  return jwt.sign({userData}, process.env.SECRET, {
        expiresIn: '5h'
      });
}