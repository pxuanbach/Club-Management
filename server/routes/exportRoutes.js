const {Router} = require('express');
const exportController = require('../controller/exportControllers');
const router = Router();

router.get('/clubs', exportController.exportClubs)
router.get('/users', exportController.exportUsers)
router.get('/activity/:activityId', exportController.exportActivity)

module.exports = router;