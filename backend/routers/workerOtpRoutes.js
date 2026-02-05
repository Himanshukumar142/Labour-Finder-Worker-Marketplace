const express = require('express');
const router = express.Router();
const {
  sendWorkerOtp,
  verifyWorkerOtp
} = require('../controllers/workerOtpController');

const { protect } = require('../models/middlewares/authMiddleware');

router.post('/send', protect, sendWorkerOtp);
router.post('/verify', protect, verifyWorkerOtp);

module.exports = router;
