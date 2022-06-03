const {Router} = require('express');
const clubController = require('../controller/clubControllers');
const upload = require('../helper/multer');
const router = Router();

router.post('/create', upload.array('file'), clubController.create)
router.post('/addmembers', clubController.addMembers)
router.get('/list/:isAdmin/:userId', clubController.getList)
router.get('/one/:clubId', clubController.getOne)
router.get('/search/:searchValue', clubController.search)
router.get('/usersearch/:userId/:searchValue', clubController.userSearch)
router.get('/searchmembers/:clubId/:searchValue', clubController.searchMembers)
router.get('/members/:clubId', clubController.getMembers)
router.get('/usersnotmembers/:clubId', clubController.getUsersNotMembers)
router.get('/searchusersnotmembers/:clubId/:searchValue', clubController.searchUsersNotMembers)
router.patch('/update/:clubId', clubController.update)
router.patch('/block/:clubId', clubController.block)
router.patch('/promote/:clubId', clubController.promote)
router.patch('/removemember/:clubId', clubController.removeMember)
router.patch('/removemembers/:clubId', clubController.removeMembers)
router.delete('/delete/:clubId/:cloudId', clubController.delete)

module.exports = router;