const {Router} = require('express');
const chatRoomController = require('../controller/chatRoomControllers');
const router = Router();

router.get('/list/:userId', chatRoomController.getList)
router.delete('/delete/:roomId', chatRoomController.deleteRoom)

module.exports = router;