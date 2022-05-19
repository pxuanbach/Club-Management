const {Router} = require('express');
const clubController = require('../controller/clubControllers')
const router = Router();

router.post('/club/create', clubController.create)
router.get('/club/list/:isAdmin/:userId', clubController.getList)
router.get('/club/one/:clubId', clubController.getOne)
router.patch('/club/update/:clubId', clubController.update)
router.delete('/club/delete/:clubId/:cloudId', clubController.delete)


module.exports = router;