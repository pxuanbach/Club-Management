const {Router} = require('express');
const activityController = require('../controller/activityControllers');
const router = Router();

router.post('/create', activityController.create)
router.post('/createcard', activityController.createCard)
router.get('/list/:clubId', activityController.getList)
router.get('/one/:activityId', activityController.getOne)
router.patch('/updateboards/:activityId', activityController.updateBoards)
router.patch('/updatecolumn/:activityId', activityController.updateColumn)

module.exports = router;