const db = require('../database/db');
const auth = require('../auth/auth');
const currentPermissions = require('../permissions/permissions');
const statusMsg = require('../http/messages');

class UserController {
  
  async logIn(req, res) {
    const {login, pwd} = req.body;
    const id = await db.checkLogin({login, pwd});
    if (id==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else if (id>0) { // login exists and pwd is correct
      // generates auth token for this user
      const token = auth.newJWT(id);
      res.status(200).json({ auth: true, token: token });
    } else { // login doesn't exists or pwd is wrong
      res.status(401).json({message: statusMsg.msgUnauthorizedLogin});
    }
  }

  async logOut(req, res) {
    // destroy auth token for this user
    res.status(200).json({ auth: false, token: null });
  }

  async addUser(req, res) {
    if (await currentPermissions.canManageUsers(req.userAuthId,res) == false) return; //res already sent

    // user is allowed to do this action
    const {login, pwd, isSuper, permissions} = req.body;
    const insertedId = await db.addUser({login, pwd, isSuper, permissions});
    if (insertedId==null) {// db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else {
    res.status(201).json({newUserId: insertedId});
    }
  }

  async editUser(req, res) {
    /* TO-DO
    if (await currentPermissions.canManageUsers(req.userAuthId,res) == false) return; //res already sent

    const id = req.params.id;
    await db.editUser(id);
    res.json({message: `updated`});
    */
  }

  async delUser(req, res) {
    if (await currentPermissions.canManageUsers(req.userAuthId,res) == false) return; //res already sent
    
    const id = req.params.id;
    const affectedRows = await db.delUser(id);
    if (affectedRows==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else { // user was deleted by this action or by any other means! the source doesn't matter
      res.status(204).json();
    }
  }

  async showUser(req, res) {
    if (await currentPermissions.canManageUsers(req.userAuthId,res) == false) return; //res already sent

    const id = req.params.id;
    const userData = await db.showUser(id);
    if (userData==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else if (userData==0) { // user not found
      res.status(200).json({});
    } else {
      res.status(200).json(userData);
    }
  }

  async showAllUsers(req, res) {
    if (await currentPermissions.canManageUsers(req.userAuthId,res) == false) return; //res already sent

    const users = await db.showAllUsersExceptSuper();
    if (users==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else {
      JSON.stringify(users);
      res.status(200).json(users);
    }
  }
}

module.exports = new UserController();