const {Router} = require('express');
const groupController = require('../controller/groupControllers')
const router = Router();

router.post('/create', groupController.create)
router.get('/list/:clubId', groupController.getList)
router.get('/search/:clubId/:searchValue', groupController.searchGroupInClub)
router.get('/allmembers/:clubId', groupController.getAll)
router.get('/searchallmembers/:clubId/:searchValue', groupController.searchAll)

module.exports = router;