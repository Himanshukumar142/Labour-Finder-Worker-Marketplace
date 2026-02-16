const Proposal = require("../models/Proposal");
const Job = require("../models/Job");

// --- 1. FREELANCER APPLIES TO A JOB ---
const createProposal = async (req, res) => {
  try {
    // Sirf Freelancer hi apply kar sakta hai
    if (req.user.role !== "FREELANCER") {
      return res.status(403).json({ message: "Only Freelancers can submit proposals" });
    }

    const { jobId, coverLetter, bidAmount, estimatedDuration } = req.body;

    // Check karein ki Job exist karta hai ya nahi
    const job = await Job.findById(jobId);
    if (!job || job.status !== "OPEN") {
      return res.status(400).json({ message: "Job not found or not open for proposals" });
    }

    // Check karein ki pehle se apply to nahi kiya?
    const existingProposal = await Proposal.findOne({ jobId, freelancerId: req.user.id });
    if (existingProposal) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const newProposal = new Proposal({
      jobId,
      freelancerId: req.user.id,
      coverLetter,
      bidAmount,
      estimatedDuration
    });

    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 2. CLIENT SEES PROPOSALS FOR A JOB ---
const getProposalsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check karein ki Job current user (Client) ka hi hai
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Security: Sirf Job Owner hi proposals dekh sakta hai
    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view these proposals" });
    }

    const proposals = await Proposal.find({ jobId })
      .populate("freelancerId", "name email freelancerProfile") // Freelancer ki details bhi layein
      .sort({ createdAt: -1 });

    res.json(proposals);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 3. CLIENT ACCEPTS/REJECTS PROPOSAL ---
const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params; // Proposal ID
    const { status } = req.body; // "ACCEPTED" or "REJECTED"

    const proposal = await Proposal.findById(id).populate("jobId");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Check ownership (Client check)
    if (proposal.jobId.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    proposal.status = status;
    await proposal.save();

    // Agar ACCEPT hua, toh Job ka status bhi update hona chahiye (Optional logic)
    // if (status === "ACCEPTED") {
    //    await Job.findByIdAndUpdate(proposal.jobId._id, { status: "IN_PROGRESS" });
    // }

    res.json(proposal);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 4. FREELANCER SEES THEIR PROPOSALS ---
const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancerId: req.user.id })
      .populate("jobId", "title company budget status") // Job ki details bhi
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createProposal, getProposalsByJob, updateProposalStatus, getMyProposals };