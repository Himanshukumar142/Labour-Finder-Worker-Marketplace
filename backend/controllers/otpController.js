const Otp = require('../models/OtpModel');

// @desc    Send OTP to phone (Simulation)
// @route   POST /api/otp/send
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        
        // 4 digit ka random OTP generate karo
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Puraane OTP delete karo agar koi hai is number par
        await Otp.deleteMany({ phone });

        // Naya OTP save karo
        await Otp.create({ phone, otp: otpCode });

        // ------------------------------------------------
        // ASLI SMS YAHAN JATA HAI (Abhi hum Console kar rahe hain)
        console.log(`🔥🔥 OTP for ${phone} is: ${otpCode} 🔥🔥`);
        // ------------------------------------------------

        res.status(200).json({ success: true, message: "OTP sent successfully (Check Server Terminal)" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};