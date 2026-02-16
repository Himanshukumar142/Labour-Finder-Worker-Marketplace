const Wallet = require("../models/wallet");
const Transaction = require("../models/Transaction");
const AuthUser = require("../models/AuthUser");

// --- GET WALLET DETAILS ---
const getWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        let wallet = await Wallet.findOne({ userId }).populate({
            path: 'transactions',
            options: { sort: { createdAt: -1 } }
        });

        if (!wallet) {
            // Create wallet if not exists (should be created at signup, but fallback)
            wallet = await Wallet.create({ userId });
        }

        // If transactions are not populated via array references, fetch them manually
        // (Depending on how other controllers add transactions)
        const recentTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(10);

        res.json({
            balance: wallet.balance,
            currency: wallet.currency,
            transactions: recentTransactions
        });

    } catch (error) {
        console.error("Get Wallet Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- ADD FUNDS (Deposit) ---
const addFunds = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, paymentDetails } = req.body; // paymentDetails can contain mock gateway info

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        // 1. Create Transaction Record
        const transaction = await Transaction.create({
            userId,
            amount,
            type: "CREDIT",
            category: "DEPOSIT",
            status: "COMPLETED", // Assuming instant success for demo
            description: "Added funds to wallet", // You can add paymentDetails info here if needed
            paymentGatewayId: "MOCK_" + Date.now()
        });

        // 2. Update Wallet Balance
        wallet.balance += Number(amount);
        wallet.transactions.push(transaction._id);
        await wallet.save();

        res.json({ message: "Funds added successfully", wallet, transaction });

    } catch (error) {
        console.error("Add Funds Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- WITHDRAW FUNDS ---
const withdrawFunds = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, bankDetails } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const wallet = await Wallet.findOne({ userId });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 1. Create Transaction Record
        const transaction = await Transaction.create({
            userId,
            amount,
            type: "DEBIT",
            category: "WITHDRAWAL",
            status: "COMPLETED", // Assuming instant success for demo
            description: `Withdrawal to ${bankDetails?.accountNumber || "Bank Account"}`,
            paymentGatewayId: "MOCK_WITHDRAW_" + Date.now()
        });

        // 2. Update Wallet Balance
        wallet.balance -= Number(amount);
        wallet.transactions.push(transaction._id);
        await wallet.save();

        res.json({ message: "Withdrawal successful", wallet, transaction });

    } catch (error) {
        console.error("Withdraw Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getWallet, addFunds, withdrawFunds };
