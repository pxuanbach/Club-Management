const {Router} = require('express');
const groupController = require('../controller/groupControllers')
const router = Router();

router.get('/list', groupController.getList)


module.exports = router;