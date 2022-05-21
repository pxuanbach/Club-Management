const {Router} = require('express');
const clubController = require('../controller/clubControllers')
const router = Router();

router.post('/create', clubController.create)
router.post('/addmembers', clubController.addMembers)
router.get('/list/:isAdmin/:userId', clubController.getList)
router.get('/one/:clubId', clubController.getOne)
router.get('/search/:searchValue', clubController.search)
router.get('/searchmembers/:clubId/:searchValue', clubController.searchMembers)
router.get('/members/:clubId', clubController.getMembers)
router.get('/usersnotmembers/:clubId', clubController.getUsersNotMembers)
router.get('/searchusersnotmembers/:clubId/:searchValue', clubController.searchUsersNotMembers)
router.patch('/update/:clubId', clubController.update)
router.patch('/block/:clubId', clubController.block)
router.patch('/promote/:clubId', clubController.promote)
router.patch('/remove/:clubId', clubController.removeMember)
router.delete('/delete/:clubId/:cloudId', clubController.delete)

module.exports = router;