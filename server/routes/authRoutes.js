const {Router} = require('express');
const authController = require('../controller/authControllers');
const router = Router();
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/verifyuser', authController.verifyuser)

module.exports = router;