const Worker = require('../models/Worker');
const WorkerOtp = require('../models/WorkerOtp');

exports.addWorker = async (req, res) => {
  try {
    const {
      name,
      phone,
      category,
      dailyWage,
      address,
      latitude,
      longitude
    } = req.body;

    // 1️⃣ Check Worker OTP verification
    const verifiedOtp = await WorkerOtp.findOne({
      phone,
      verified: true
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Worker phone number not verified"
      });
    }

    // 2️⃣ Check if worker already exists
    const workerExists = await Worker.findOne({ phone });
    if (workerExists) {
      return res.status(400).json({
        message: "Worker already registered with this phone number"
      });
    }

    // 3️⃣ Create Worker
    const worker = await Worker.create({
      name,
      phone,
      category,
      dailyWage,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude)
        ],
        address
      },
      addedBy: req.user._id
    });

    // 4️⃣ Cleanup worker OTP
    await WorkerOtp.deleteMany({ phone });

    res.status(201).json({
      success: true,
      message: "Worker added successfully",
      worker
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workers added by the logged-in agent
// @route   GET /api/workers/my-workers
// @access  Private
exports.getMyWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({ addedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: workers.length, workers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a worker (Needs OTP)
// @route   DELETE /api/workers/:id
// @access  Private
exports.deleteWorker = async (req, res) => {
    try {
        const { otp } = req.body; // OTP body se aayega
        const worker = await Worker.findById(req.params.id);

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        // 1. Verify OTP sent to Worker's phone
        const validOtp = await Otp.findOne({ phone: worker.phone, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid OTP! Cannot delete worker." });
        }

        await worker.deleteOne();
        
        // Cleanup OTP
        await Otp.deleteMany({ phone: worker.phone });

        res.status(200).json({ message: "Worker verified & deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update worker details (Needs OTP)
// @route   PUT /api/workers/:id
// @access  Private
exports.updateWorker = async (req, res) => {
    try {
        const { name, category, dailyWage, address, latitude, longitude, otp } = req.body;
        const worker = await Worker.findById(req.params.id);

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        // 1. Verify OTP
        const validOtp = await Otp.findOne({ phone: worker.phone, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid OTP! Cannot update details." });
        }

        // 2. Update Fields (Jo data aaya hai bas wahi update karo)
        worker.name = name || worker.name;
        worker.category = category || worker.category;
        worker.dailyWage = dailyWage || worker.dailyWage;
        
        // Location update logic
        if (latitude && longitude) {
            worker.location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
                address: address || worker.location.address
            };
        } else if (address) {
            // Agar sirf address change hua hai
            worker.location.address = address;
        }

        const updatedWorker = await worker.save();
        
        // Cleanup OTP
        await Otp.deleteMany({ phone: worker.phone });

        res.status(200).json({ 
            success: true, 
            message: "Worker details updated successfully!", 
            worker: updatedWorker 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Find workers nearby (5km Radius)
// @route   POST /api/workers/nearby
// @access  Public
exports.getNearbyWorkers = async (req, res) => {
  try {
    const { latitude, longitude, category } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required"
      });
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude)
            ]
          },
          distanceField: "distance",
          spherical: true,
          distanceMultiplier: 0.001,
          maxDistance: 5000
        }
      }
    ];

    if (category) {
      pipeline.push({ $match: { category } });
    }

    const workers = await Worker.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: workers.length,
      workers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
