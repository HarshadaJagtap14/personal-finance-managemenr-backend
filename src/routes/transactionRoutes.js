import express from "express";
import Transaction from "../models/Transaction.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get All Transactions
router.get("/", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add Transaction
router.post("/", protect, async (req, res) => {
  try {
    const { type, amount } = req.body;
    if (!type || !amount) return res.status(400).json({ message: "All fields are required" });

    const transaction = await Transaction.create({ userId: req.user.id, type, amount });
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
