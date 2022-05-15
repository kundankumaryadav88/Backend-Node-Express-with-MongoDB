const router = require('express').Router();
const { verifyUserToken, IsAdmin, IsUser, IsManager } = require("../middleware/auth");
const userController = require('../controllers/user');

// Register a new User
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Auth user only
router.get('/events', verifyUserToken, IsUser, userController.userEvent);

// Auth Admin only
router.get('/special', verifyUserToken, IsAdmin, userController.adminEvent);

//Create operation By Admin
router.post('/product',verifyUserToken, IsAdmin, userController.createproduct);

// Get operation By Admin and manager
router.get('/getproduct',verifyUserToken, IsAdmin || IsManager, userController.findAllproduct);

// update operation By Admin and manager
router.put('/updateproduct',verifyUserToken, IsAdmin || IsManager, userController.updateproduct);

module.exports = router;