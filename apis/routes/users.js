const express = require('express');
const router = express.Router();
const userController = require('./../controllers/users')

// create user
router.post('/signup', userController.createUser);


// get all users
router.get('/', userController.getAllUsers );


// get single user
router.get('/:userId', userController.getSingleUser);


// delete user
router.delete('/:userId', userController.deleteUser);


// user login
router.post('/login', userController.loginUser)

module.exports = router;