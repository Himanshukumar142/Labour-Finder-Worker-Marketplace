const Contract = require("../models/ContractModel"); // Note: Model file ka naam check karlena
const Wallet = require("../models/wallet");
const Job = require("../models/Job");
const Proposal = require("../models/Proposal");

// --- 1. CREATE CONTRACT (Jab Client "Hire" karega) ---
const createContract = async (req, res) => {
  try {
    const { proposalId } = req.body;

    // Proposal dhundo
    const proposal = await Proposal.findById(proposalId).populate("jobId");
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    // Check: Kya Client wahi hai jisne Job post kiya?
    // req.user ab AuthUser se aa raha hai
    if (proposal.jobId.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Naya Contract banao
    const newContract = new Contract({
      jobId: proposal.jobId._id,
      clientId: req.user.id,
      freelancerId: proposal.freelancerId,
      proposalId: proposal._id,
      agreedAmount: proposal.bidAmount,
      status: "NEW",           
      paymentStatus: "PENDING" 
    });

    await newContract.save();

    // Proposal ko ACCEPTED mark kar do
    proposal.status = "ACCEPTED";
    await proposal.save();

    res.status(201).json(newContract);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- 2. FUND CONTRACT (Client paisa lock karega) ---
const fundContract = async (req, res) => {
  try {
    const { contractId } = req.body;
    const contract = await Contract.findById(contractId);

    if (!contract) return res.status(404).json({ message: "Contract not found" });

    // Client ka Wallet dhundo (Ab userId 'AuthUser' ko refer karta hai)
    const clientWallet = await Wallet.findOne({ userId: req.user.id });

    if (!clientWallet) {
        return res.status(404).json({ message: "Wallet not found" });
    }

    // Check Balance
    if (clientWallet.balance < contract.agreedAmount) {
      return res.status(400).json({ message: "Insufficient Balance in Wallet" });
    }

    // 1. Client ke paise kato
    clientWallet.balance -= contract.agreedAmount;
    
    // 2. Contract Status update karo
    contract.paymentStatus = "FUNDED";
    contract.status = "ACTIVE"; // Kaam shuru!

    await clientWallet.save();
    await contract.save();

    res.json({ message: "Contract Funded & Active", contract });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment Failed" });
  }
};

// --- 3. RELEASE PAYMENT (Kaam hone par paisa Freelancer ko) ---
const releasePayment = async (req, res) => {
  try {
    const { contractId } = req.body;
    const contract = await Contract.findById(contractId);

    // Sirf Client hi paisa release kar sakta hai
    if (contract.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only Client can release funds" });
    }

    if (contract.paymentStatus !== "FUNDED") {
      return res.status(400).json({ message: "Contract is not funded yet" });
    }

    // Freelancer ka Wallet dhundo
    const freelancerWallet = await Wallet.findOne({ userId: contract.freelancerId });

    // Freelancer ko paisa do
    freelancerWallet.balance += contract.agreedAmount;
    
    // Contract update karo
    contract.paymentStatus = "RELEASED";
    contract.status = "COMPLETED";

    await freelancerWallet.save();
    await contract.save();

    res.json({ message: "Payment Released to Freelancer", contract });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Release Failed" });
  }
};

module.exports = { createContract, fundContract, releasePayment };