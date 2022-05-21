const {Router} = require('express');
const authController = require('../controller/authControllers');
const clubController = require('../controller/clubControllers');
const upload = require('../helper/multer')
const router = Router();

router.post('/signup', upload.array('file'), authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/verifyuser', authController.verifyuser)
router.get('/verifyclub/:club_id', clubController.verifyclub)

module.exports = router;