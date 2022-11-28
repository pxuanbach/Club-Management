const {Router} = require('express');
const exportController = require('../controller/exportControllers');
const router = Router();

router.get('/clubs', exportController.exportClubs)
router.get('/users', exportController.exportUsers)
router.get('/activity/:activityId/:createdBy', exportController.exportActivity)
router.get('/log/:clubId/:createdBy', exportController.exportClubLogs)
router.get('/members/:clubId/:createdBy', exportController.exportMembers)
router.get('/memberpoints/:clubId/:createdBy', exportController.exportMemberPoints)
router.get('/points/:clubId/:createdBy/user/:userId', exportController.exportUserPointsOfClub)

module.exports = router;