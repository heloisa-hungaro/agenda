const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/login', UserController.logIn);
router.post('/logout', UserController.logOut);
router.get('/users', UserController.verifyJWT, UserController.showAllUsers);
router.get('/users/:id', UserController.verifyJWT, UserController.showUser);
router.post('/users', UserController.verifyJWT, UserController.verifyJWT, UserController.addUser);
router.put('/users/:id', UserController.verifyJWT, UserController.editUser);
router.delete('/users/:id', UserController.verifyJWT, UserController.delUser);

module.exports = router;