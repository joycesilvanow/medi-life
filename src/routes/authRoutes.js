const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/login', (req, res) => AuthController.login(req, res));

module.exports = router;
