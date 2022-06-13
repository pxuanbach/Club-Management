const {Router} = require('express');
const schedulerController = require('../controller/schedulerControllers');
const router = Router();

router.get('/list/:userId', schedulerController.getScheduler)
router.get('/club/:clubId', schedulerController.getClubScheduler)

module.exports = router;