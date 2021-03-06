const {Router} = require('express');
const userController = require('../controller/userControllers')
const router = Router();

router.get('/list', userController.getList)
router.get('/one/:userId', userController.getOne)
router.get('/search/:searchValue', userController.search)
router.patch('/block/:userId', userController.block)

module.exports = router;