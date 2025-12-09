const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivity,
  deleteActivity,
  updateActivity,
} = require("../../controllers/activities");

router.post("/", createActivity);

router.get("/", getActivities);

router.get("/:id", getActivity);

router.put("/:id", updateActivity);

router.delete("/:id", deleteActivity);

module.exports = router;
