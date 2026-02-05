const express = require("express");
const router = express.Router();

const {
  addWorker,
  getMyWorkers,
  deleteWorker,
  updateWorker,
  getNearbyWorkers,
} = require("../controllers/workerController");

const { protect } = require("../models/middlewares/authMiddleware");
const role = require("../models/middlewares/roleMiddleware");


// ===================== AGENT =====================
// Agent → Add / Manage Workers
router.post(
  "/agent/workers",
  protect,
  role("agent"),
  addWorker
);

router.get(
  "/agent/workers",
  protect,
  role("agent"),
  getMyWorkers
);

router.put(
  "/agent/workers/:id",
  protect,
  role("agent"),
  updateWorker
);

router.delete(
  "/agent/workers/:id",
  protect,
  role("agent"),
  deleteWorker
);


// ===================== PERSONAL =====================
// Personal user bhi worker add kar sakta hai
router.post(
  "/personal/workers",
  protect,
  role("personal"),
  addWorker
);

router.get(
  "/personal/workers",
  protect,
  role("personal"),
  getMyWorkers
);


// ===================== PUBLIC =====================
router.post("/workers/nearby", getNearbyWorkers);

module.exports = router;
