'use strict';

const express = require('express');
const cors = require('cors');
const auth = require('../auth/auth');
const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET, POST, PUT, DELETE',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const router = express.Router();

router.options('*', cors(corsOptions));
router.post('/login', cors(corsOptions), LoginController.logIn);
router.post('/logout', cors(corsOptions), LoginController.logOut);
router.get('/users', cors(corsOptions), auth.verifyJWT, UserController.showAllUsers);
router.get('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.showUser);
router.post('/users', cors(corsOptions), auth.verifyJWT, UserController.addUser);
router.put('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.editUser);
router.delete('/users/:id', cors(corsOptions), auth.verifyJWT, UserController.delUser);

router.get('/', (request, response) => {
  response.send('Server is running!');
});

module.exports = router;