const User = require("../models/User");
const generateToken = require("../utils/token");

async function signup(req, res) {
  try {
    const { name, email, password, grade } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, grade });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      grade: user.grade,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getProfile(req, res) {
  res.json(req.user);
}

module.exports = { signup, login, getProfile };
