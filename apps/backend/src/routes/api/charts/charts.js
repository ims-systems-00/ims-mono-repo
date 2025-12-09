const router = require("express").Router();

const {
  createChart,
  getChart,
  listCharts,
  updateChart,
  hardRemoveChart,
} = require("../../../controllers/charts");
const {
  IMS_SERVICES,
  ACTIONS,
  EFFECTS,
} = require("@ims-systems-00/ims-core/lib/constants");

router.post("/", [], createChart);
router.get("/:id", [], getChart);
router.get("/", [], listCharts);
router.put("/:id", [], updateChart);
// router.put("/:id/restore", [], restoreImsProject);
// router.delete("/:id/soft", [], softRemoveImsProject);
router.delete("/:id/hard", [], hardRemoveChart);

module.exports = router;
