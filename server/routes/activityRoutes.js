const {Router} = require('express');
const activityController = require('../controller/activityControllers');
const router = Router();

router.post('/create', activityController.create)
router.get('/list/:clubId', activityController.getList)
router.get('/one/:activityId', activityController.getOne)

module.exports = router;