const express = require('express');
const router = express.Router();
const controller = require('../controllers/appController');

// Basic route handlers
router.get('/', controller.renderHome);
router.get('/dashboard', controller.renderDashboard);
router.get('/login', controller.renderLogin);
router.get('/register', controller.renderRegister);

module.exports = router;