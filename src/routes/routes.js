const express = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../auth/auth');

const router = express.Router();

router.post('/login', UserController.logIn);
router.post('/logout', UserController.logOut);
router.get('/users', auth.verifyJWT, UserController.showAllUsers);
router.get('/users/:id', auth.verifyJWT, UserController.showUser);
router.post('/users', auth.verifyJWT, UserController.addUser);
router.put('/users/:id', auth.verifyJWT, UserController.editUser);
router.delete('/users/:id', auth.verifyJWT, UserController.delUser);

router.get('/', (request, response) => {
  response.send('Server is running!');
});

module.exports = router;