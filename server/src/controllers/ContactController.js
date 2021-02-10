'use strict';

const db = require('../database/db');
const statusMsg = require('../http/messages');


class ContactController {

  async addContact(req, res) {
    if (!(req.userAuth.super==0 && req.userAuth.perm_add==1)) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const {name, address, fones, emails, notes} = req.body;
    const insertedId = await db.addContact({name, address, fones, emails, notes});
    if (insertedId==null) {// db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else {
    res.status(201).json({newContactId: insertedId});
    }
  }

  async editContact(req, res) {
    if (!(req.userAuth.super==0 && req.userAuth.perm_edit==1)) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const id = req.params.id;
    const contNewData = req.body;
    const affectedRows = await db.editContact(id, contNewData);
    if (affectedRows==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else { // user was updated
      res.status(200).json();
    }
  }

  async delContact(req, res) {
    if (!(req.userAuth.super==0 && req.userAuth.perm_del==1)) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const id = req.params.id;
    const affectedRows = await db.delContact(id);
    if (affectedRows==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else { // contact was deleted by this action or by any other means! the source doesn't matter
      res.status(200).json();
    }
  }

  async showContact(req, res) {
    if (req.userAuth.super!=0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const id = req.params.id;
    const contactData = await db.showContact(id);
    if (contactData==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else if (contactData==0) { // contact not found
      res.status(200).json({});
    } else {
      res.status(200).json(contactData);
    }
  }

  async showSelectedContacts(req, res) {
    if (req.userAuth.super!=0) {
      res.status(403).json({message: statusMsg.msgForbidden});
      return;
    }

    const searchName = req.query.name;
    if (searchName==null) { //req incompleta
      res.status(400).json({message: statusMsg.msgBadRequest});
    }
    const contacts = await db.showSelectedContacts(searchName);
    if (contacts==null) { // db error
      res.status(500).json({message: statusMsg.msgDbError});
    } else {
      JSON.stringify(contacts);
      res.status(200).json(contacts);
    }
  }
}

module.exports = new ContactController();