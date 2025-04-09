const express = require('express');
const UserController = require('../controller/UserController');
const authController = require('../controller/authController');
const router = express.Router();

router.post('/signup', UserController.saveNewUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout)
router.get('/user/:id', UserController.getUserByID);
router.get('/users', UserController.getAllUsersFromDB);
router.put('/update-user/:id', UserController.updateUserByID);
router.delete('/delete-user/:id', UserController.deleteUserFromDB);

module.exports = router;

