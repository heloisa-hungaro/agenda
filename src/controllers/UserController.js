const db = require('../database/db');
const jwt = require('jsonwebtoken');


class UserController {
  
  verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar token.' });
      // se tudo estiver ok, salva no request para uso posterior
      req.userDecodedId = decoded.id;
      next();
    });
  }

  async logIn(req, res) {
    const {login, pwd} = req.body;
    const id = await db.checkLogin({login, pwd});
    if (id>0) {
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // expires in 5min
      });
      res.json({ auth: true, token: token });
    } else {
      res.status(500).json({message: 'Login inválido!'});
    }
  }

  async logOut(req, res) {
    res.json({ auth: false, token: null });
  }

  async addUser(req, res) {
    const {login, pwd, isSuper, permissions} = req.body;
    const insertedId = await db.addUser({login, pwd, isSuper, permissions});
    console.log(insertedId);
    res.json({message: `new user added with id = ${insertedId} `});
  }

  async editUser(req, res) {
    const id = req.params.id;
    await db.editUser(id);
    res.json({message: `updated`});
  }

  async delUser(req, res) {
    const id = req.params.id;
    const affectedRows = await db.delUser(id);
    res.json(affectedRows);
  }

  async showUser(req, res) {
    const id = req.params.id;
    const user = await db.showUser(id);
    res.json(user);
  }

  async showAllUsers(req, res) {
    const users = await db.showAllUsersExceptSuper();
    JSON.stringify(users);
    res.json(users);
  }
}

module.exports = new UserController();