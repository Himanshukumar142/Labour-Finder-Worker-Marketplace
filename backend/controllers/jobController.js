const Job = require("../models/Job");
const User = require("../models/AuthUser");

// --- 1. POST A JOB (Only Client) ---
const postJob = async (req, res) => {
  try {
    // Check karein ki user 'CLIENT' hai ya nahi
    if (req.user.role !== "CLIENT") {
      return res.status(403).json({ message: "Only Clients can post jobs" });
    }

    const { title, description, budget, skillsRequired, category, deadline } = req.body;

    // Naya Job create karein
    const newJob = new Job({
      clientId: req.user.id, // Logged in user ka ID
      title,
      description,
      budget,
      skillsRequired, // Array e.g. ["React", "Node"]
      category,
      deadline
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error posting job" });
  }
};

// --- 2. GET ALL JOBS (Filters ke saath) ---
const getAllJobs = async (req, res) => {
  try {
    const { category, minBudget, search } = req.query;

    let query = { status: "OPEN" }; // Sirf Open jobs dikhayenge

    // Filters apply karein
    if (category) {
      query.category = category;
    }

    if (minBudget) {
      query.budget = { $gte: Number(minBudget) }; // Budget kam se kam itna ho
    }

    if (search) {
      query.title = { $regex: search, $options: "i" }; // Search by title
    }

    // Database se jobs layein aur Client ka naam populate karein
    const jobs = await Job.find(query)
      .populate("clientId", "name email")
      .sort({ createdAt: -1 }); // Latest pehle

    res.json(jobs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching jobs" });
  }
};

// --- 3. GET SINGLE JOB DETAILS ---
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("clientId", "name");
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 4. GET MY POSTED JOBS (Client Dashboard ke liye) ---
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ clientId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { postJob, getAllJobs, getJobById, getMyJobs };