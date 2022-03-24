const {Router} = require('express');
const authController = require('../controller/authControllers');
const router = Router();
router.post('/signup', authController.signup)

module.exports = router;