const {Router} = require('express');
const pointController = require("../controller/pointControllers");
const router = Router();

router.get("/club/:clubId", pointController.getPointsOfClub);
router.get("/club/:clubId/user/:userId", pointController.getPointsOfMember);
router.get("/club/:clubId/report", pointController.reportOfClub);
router.post("/club/:clubId", pointController.createPointOfClub);
router.post("/club/:clubId/multi", pointController.createMultiPointsOfClub);

module.exports = router;