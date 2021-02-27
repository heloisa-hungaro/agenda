'use strict';

const express = require('express');
const cors = require('cors');
const auth = require('../auth/auth');
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const ContactController = require('../controllers/ContactController');

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET, POST, PATCH, DELETE',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}; 

const router = express.Router();

//for cors preflight
router.options('*', cors(corsOptions));

//login
router.post('/login', cors(corsOptions), LoginController.logIn);
//router.post('/logout', cors(corsOptions), LoginController.logOut);

//users
router.get('/users', cors(corsOptions), auth.verifyJWT, UserController.showAllUsers);
router.get('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.showUser);
router.post('/users', cors(corsOptions), auth.verifyJWT, UserController.addUser);
router.patch('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.editUser);
router.delete('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.delUser);

//contacts
router.get('/contacts', cors(corsOptions), auth.verifyJWT, ContactController.showSelectedContacts);
router.get('/contacts/:id', cors(corsOptions), auth.verifyJWT, ContactController.showContact);
router.post('/contacts', cors(corsOptions), auth.verifyJWT, ContactController.addContact);
router.patch('/contacts/:id', cors(corsOptions), auth.verifyJWT, ContactController.editContact);
router.delete('/contacts/:id', cors(corsOptions), auth.verifyJWT, ContactController.delContact);


router.get('/', (request, response) => {
  response.send('Server is running!');
});

module.exports = router;