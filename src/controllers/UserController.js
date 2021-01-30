const db = require('../database/db');
const auth = require('../auth/auth');

class UserController {
  

  async logIn(req, res) {
    const {login, pwd} = req.body;
    const id = await db.checkLogin({login, pwd});
    if (id>0) {
      const token = auth.newJWT(id);
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