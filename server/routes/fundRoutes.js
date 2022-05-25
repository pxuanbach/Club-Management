const {Router} = require('express');
const fundController = require('../controller/fundControllers')
const router = Router();

router.post('/create', fundController.create)
router.get('/list/:clubId', fundController.getList)
router.get('/colpayinmonth/:clubId', fundController.getColPayInMonth)
// router.get('/one/:groupId', groupController.getOne)
// router.get('/search/:clubId/:searchValue', groupController.searchGroupInClub)
// router.get('/allmembers/:clubId', groupController.getAll)
// router.get('/allmembersnotingroup/:groupId', groupController.getAllNotInGroup)
// router.get('/searchallmembers/:clubId/:searchValue', groupController.searchAll)
// router.get('/searchallmembersnotingroup/:groupId/:searchValue', groupController.searchAllNotInGroup)
// router.patch('/update/:groupId', groupController.update)
// router.delete('/delete/:groupId', groupController.delete)

module.exports = router;