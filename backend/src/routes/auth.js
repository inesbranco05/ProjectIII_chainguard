const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');


router.post('/register', validateUser, AuthController.register);

router.post('/login', AuthController.login);

router.get('/profile', authMiddleware, AuthController.getProfile);

router.put('/profile', authMiddleware, AuthController.updateProfile);


router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;