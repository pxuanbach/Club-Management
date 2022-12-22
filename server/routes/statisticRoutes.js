const {Router} = require('express');
const statisticController = require('../controller/statisticControllers')
const router = Router();


router.get('/club/:clubId/memberjoin', statisticController.statisticMemberJoinOfClub)
router.get('/club/:clubId/memberleave', statisticController.statisticMemberLeaveOfClub)
router.get('/club/:clubId/fundgrowth', statisticController.statisticFundGrowthOfClub)
router.get('/club/:clubId/fundwithtype', statisticController.statisticFundWithTypeOfClub)
router.get('/club/:clubId/monthlyfundgrowth', statisticController.statisticMonthlyFundGrowthOfClub)
router.get('/club/:clubId/quantitysubmittedmonthlyfund', statisticController.statisticQuantitySubmittedMonthlyFundOfClub)



module.exports = router;