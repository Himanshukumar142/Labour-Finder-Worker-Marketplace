const express = require('express');
const router = express.Router();
const { sendOtp } = require('../controllers/otpController');

router.post('/send', sendOtp); // OTP bhejne ka route

module.exports = router;