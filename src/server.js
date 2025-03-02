


import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// ✅ Debug Middleware - Logs every request
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} ${req.url}`);
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Body:', req.body);
  next();
});

// 🔒 **Register Route**
app.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// 🔑 **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }); // ✅ FIXED: Changed `Users` → `User`
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });

  } catch (error) {
    console.error("🔴 Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🌐 **Default Route**
app.get('/', (req, res) => {
  res.send('🚀 Personal Finance Manager API Running!');
});

// 🔍 **Get All Users (For Testing)**
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/dashboard", async (req, res) => {
  try {
    res.json({ message: "Dashboard loaded successfully!" });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// 🚀 **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
