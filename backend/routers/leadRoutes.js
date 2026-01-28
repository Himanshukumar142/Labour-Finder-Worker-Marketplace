const express = require('express');
const router = express.Router();
const { createLead, getAgentLeads } = require('../controllers/leadController');
const { protect } = require('../models/middlewares/authMiddleware');

// Call record karne ke liye (User login hona zaroori hai)
router.post('/', protect, createLead);

// Agent ke liye analytics
router.get('/my-leads', protect, getAgentLeads);

module.exports = router;