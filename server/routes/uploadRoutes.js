const {Router} = require('express');
const uploadController = require('../controller/uploadControllers');
const upload = require('../helper/multer')
const router = Router();
router.post('/upload', upload.array('file'), uploadController.upload)

module.exports = router;