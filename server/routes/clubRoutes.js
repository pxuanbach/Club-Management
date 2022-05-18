const {Router} = require('express');
const clubController = require('../controller/clubControllers')
const router = Router();

router.get('/club/list/:isAdmin/:userId', clubController.getList)

module.exports = router;