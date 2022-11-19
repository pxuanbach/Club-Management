const {Router} = require('express');
const clubRequestController = require('../controller/clubRequestControllers');
const activityRequestController = require('../controller/activityRequestControllers');
const router = Router();

// club
router.get('/club', clubRequestController.getList)
router.post('/club', clubRequestController.create)
router.patch('/club/:requestId', clubRequestController.updateStatus)

// activity
router.get('/activity', activityRequestController.getList)
router.post('/activity', activityRequestController.create)
router.patch('/activity/:requestId', activityRequestController.updateStatus)


module.exports = router;