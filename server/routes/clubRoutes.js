const {Router} = require('express');
const clubController = require('../controller/clubControllers')
const router = Router();

router.post('/club/create', clubController.create)
router.post('/club/addmembers', clubController.addMembers)
router.get('/club/list/:isAdmin/:userId', clubController.getList)
router.get('/club/one/:clubId', clubController.getOne)
router.get('/club/search/:searchValue', clubController.search)
router.get('/club/searchmembers/:clubId/:searchValue', clubController.searchMembers)
router.get('/club/members/:clubId', clubController.getMembers)
router.get('/club/usersnotmembers/:clubId', clubController.getUsersNotMembers)
router.get('/club/searchusersnotmembers/:clubId/:searchValue', clubController.searchUsersNotMembers)
router.patch('/club/update/:clubId', clubController.update)
router.patch('/club/block/:clubId', clubController.block)
router.patch('/club/promote/:clubId', clubController.promote)
router.patch('/club/remove/:clubId', clubController.removeMember)
router.delete('/club/delete/:clubId/:cloudId', clubController.delete)

module.exports = router;