const express = require('express');
const router = express.Router();
const { addWorker, getMyWorkers, deleteWorker, updateWorker, getNearbyWorkers } = require('../controllers/workerController');
const { protect } = require('../../backend/models/middlewares/authMiddleware'); // 👈 Security Guard

// Dono routes ko 'protect' middleware se guzarna padega
router.post('/', protect, addWorker);
router.get('/my-workers', protect, getMyWorkers);
router.put('/:id', protect, updateWorker);
router.post('/nearby', getNearbyWorkers);
module.exports = router;