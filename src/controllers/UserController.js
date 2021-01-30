const bcrypt = require('bcrypt');
const db = require('../database/db');


class UserController {

  async addUser(req, res) {
    const {login, psw, isSuper, permissions} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const pswCript = bcrypt.hashSync(psw, salt);
    const insertedId = await db.addUser({login, pswCript, isSuper, permissions});
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
    //console.log(bcrypt.compareSync('123', user.psw));
    res.json(user);
  }

  async showAllUsers(req, res) {
    const users = await db.showAllUsersExceptSuper();
    JSON.stringify(users);
    res.json(users);
  }
}

module.exports = new UserController();