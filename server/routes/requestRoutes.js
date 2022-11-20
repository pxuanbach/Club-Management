const {Router} = require('express');
const clubRequestController = require('../controller/clubRequestControllers');
const activityRequestController = require('../controller/activityRequestControllers');
const router = Router();

// club
router.get('/club', clubRequestController.getList)
router.post('/club', clubRequestController.create)
router.post('/club/multi', clubRequestController.createMulti)
router.patch('/club/:requestId', clubRequestController.updateStatus)

// activity
router.get('/activity', activityRequestController.getList)
router.post('/activity', activityRequestController.create)
router.post('/activity/multi', activityRequestController.createMulti)
router.patch('/activity/:requestId', activityRequestController.updateStatus)


module.exports = router;