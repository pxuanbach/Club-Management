const {Router} = require('express');
const fundController = require('../controller/fundControllers');
const upload = require('../helper/multer');
const router = Router();

router.post('/create', upload.array('file'), fundController.create)
router.get('/list/:clubId', fundController.getList)
router.get('/monthlyfund/:clubId', fundController.getMonthlyFunds)
router.get('/monthlyfund/:clubId/one', fundController.getMonthlyFund)
router.get('/colpayinmonth/:clubId', fundController.getColPayInMonth)
router.get('/search/:clubId/:searchValue', fundController.search)
router.get('/:fundId', fundController.getFundHistoryById)
router.patch('/monthlyfund/:clubId', fundController.updateSubmitted)

module.exports = router;