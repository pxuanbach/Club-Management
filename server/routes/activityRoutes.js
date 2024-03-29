const {Router} = require('express');
const activityController = require('../controller/activityControllers');
const upload = require('../helper/multer')
const router = Router();

router.post('/create', activityController.create)
router.post('/createcard', activityController.createCard)
router.get('/list/:clubId', activityController.getList)
router.get('/one/:activityId', activityController.getOne)
router.get('/collaborators/:activityId', activityController.getCollaborators)
// router.get('/collaborators/:activityId', activityController.getCollaboratorsAndPoints)
router.get('/usersnotcollaborators/:activityId', activityController.getUsersNotCollaborators)
router.get('/search/:clubId/:searchValue', activityController.search)
router.get('/searchcollaborators/:activityId/:searchValue', activityController.searchCollaborators)
router.get('/searchusersnotcollaborators/:activityId/:searchValue', activityController.searchUsersNotCollaborators)
router.put('/update/:activityId', activityController.update)
router.patch('/updateboards/:activityId', activityController.updateBoards)
router.patch('/updatecolumn/:activityId', activityController.updateColumn)
router.patch('/updatecollaborators/:activityId', activityController.updateCollaborators)
router.patch('/addcollaborators/:activityId', activityController.addCollaborators)
router.patch('/deleteallcards/:activityId', activityController.deleteAllCards)
router.patch('/sumary/:activityId', activityController.sumary)
router.patch('/config/:activityId', activityController.config)
router.delete('/delete/:activityId', activityController.delete)

router.post('/userjoin', activityController.userJoin)
router.post('/groupjoin', activityController.groupJoin)
router.post('/card/upload', upload.array('file'), activityController.upload)
router.post('/card/addcomment', activityController.addComment)
router.get('/card/:cardId', activityController.getCard)
router.patch('/card/userexit/:cardId', activityController.userExitCard)
router.patch('/card/groupexit/:cardId', activityController.groupExitCard)
router.patch('/card/description/:cardId', activityController.updateCardDescription)
router.patch('/card/deletecomment/:cardId', activityController.deleteComment)
router.patch('/card/deletefile/:cardId', activityController.deleteFile)
router.patch('/card/point/:cardId', activityController.updatePoint)
router.delete('/card/:cardId', activityController.deleteCard)

module.exports = router;