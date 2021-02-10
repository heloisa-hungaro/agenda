'use strict';

const db = require('../database/db');
const auth = require('../auth/auth');
const statusMsg = require('../http/messages');

class LoginController {

  async logIn(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const {login, pwd} = req.body;
    const userData = await db.checkLogin({login, pwd});
    if (userData==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else if (userData==0) { // login doesn't exists or pwd is wrong
      res.status(401).json({message: statusMsg.msgUnauthorizedLogin});
    } else { // login exists and pwd is correct
      // generates auth token for this user
      delete userData.pwd;
      delete userData.id;
      const token = auth.newJWT(userData);
      res.status(200).json({ auth: true, token: token });
    }
  }

  async logOut(req, res) {
    // destroy auth token for this user
    res.status(200).json({ auth: false, token: null });
  }
}

module.exports = new LoginController();