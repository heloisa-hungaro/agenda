'use strict';

const db = require('../database/db');
const statusMsg = require('../http/messages');


class UserController {

  async addUser(req, res) {
    if (req.userAuth.super==0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

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
    if (req.userAuth.super==0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }
    /* TO-DO
    
    const id = req.params.id;
    await db.editUser(id);
    res.json({message: `updated`});
    */
  }

  async delUser(req, res) {
    if (req.userAuth.super==0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const id = req.params.id;
    const affectedRows = await db.delUser(id);
    if (affectedRows==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else { // user was deleted by this action or by any other means! the source doesn't matter
      res.status(200).json();
    }
  }

  async showUser(req, res) {
    if (req.userAuth.super==0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

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
    if (req.userAuth.super==0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

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