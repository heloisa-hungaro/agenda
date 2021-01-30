const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/users', UserController.showAllUsers);
router.get('/users/:id', UserController.showUser);
router.post('/users', UserController.addUser);
router.put('/users/:id', UserController.editUser);
router.delete('/users/:id', UserController.delUser);

module.exports = router;