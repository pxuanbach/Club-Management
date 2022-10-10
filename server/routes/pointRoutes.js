const {Router} = require('express');
const pointController = require("../controller/pointControllers");
const router = Router();

router.get("/:clubId", pointController.getPointsOfClub);
router.get("/:clubId/report", pointController.reportOfClub);
router.post("/:clubId", pointController.createPointOfClub);

module.exports = router;