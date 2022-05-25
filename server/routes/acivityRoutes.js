const {Router} = require('express');
const activityController = require('../controller/activityControllers');
const router = Router();

router.post('/create', activityController.create)

module.exports = router;