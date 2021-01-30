const jwt = require('jsonwebtoken');
const dotenv = require('dotenv-safe').config();

module.exports.verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar token.' });
    // se tudo estiver ok, salva no request para uso posterior
    req.userDecodedId = decoded.id;
    next();
  });
}

module.exports.newJWT = (id) => {
  return jwt.sign({id}, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
}