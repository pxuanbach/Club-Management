const {Router} = require('express');
const clubController = require('../controller/clubControllers')
const router = Router();
const bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()

router.post('/club/create', clubController.create)
router.get('/club/list/:isAdmin/:userId', clubController.getList)


module.exports = router;