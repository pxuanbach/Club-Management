const {Router} = require('express');
const clubRequestController = require('../controller/clubRequestControllers');
const activityRequestController = require('../controller/activityRequestControllers');
const router = Router();

// club
router.post('/club', clubRequestController.create)
router.patch('/club/:requestId', clubRequestController.update_status)

// activity
router.post('/activity', activityRequestController.create)


module.exports = router;