const Lead = require('../models/LeadModel');
const Worker = require('../models/Worker');

// @desc    Record a call (lead) to a worker
// @route   POST /api/leads
// @access  Private (User/Customer logged in hona chahiye)
exports.createLead = async (req, res) => {
    try {
        const { workerId } = req.body;

        // 1. Check karo worker exist karta hai ya nahi
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        // 2. Lead create karo
        const lead = await Lead.create({
            workerId: workerId,
            customerId: req.user._id // Jo user login hai
        });

        // 3. Response bhejo (Frontend iske baad call milayega)
        res.status(201).json({ 
            success: true, 
            message: "Call recorded successfully", 
            workerPhone: worker.phone // Frontend ko number bhejo taaki wo dial kar sake
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leads for an Agent (Agent dekh sakega uske workers ko kitni call aayi)
// @route   GET /api/leads/my-leads
// @access  Private (Agent Only)
exports.getAgentLeads = async (req, res) => {
    try {
        // Aise leads dhoondo jahan worker 'Agent' ka ho
        // Ye thoda complex query hai, abhi simple rakhte hain
        // Future mein hum isse Agent Dashboard par dikhayenge
        res.status(200).json({ message: "Analytics feature coming soon!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};