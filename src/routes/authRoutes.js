


import express from "express";
import User from "../models/User.js"; // Adjust path if needed
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, "your_jwt_secret", { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
      const existingUser = await User.findOne({ email: email.toLowerCase() }); // CHECK LOWERCASE EMAIL
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ 
          name, 
          email: email.toLowerCase(),  // STORE LOWERCASE EMAIL
          password: hashedPassword 
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

export default router;
