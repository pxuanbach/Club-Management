const {Router} = require('express');
const schedulerController = require('../controller/schedulerControllers');
const router = Router();

router.get('/list/:userId', schedulerController.getScheduler)


module.exports = router;