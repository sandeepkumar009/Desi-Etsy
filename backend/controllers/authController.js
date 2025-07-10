import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Artisan from '../models/artisanModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// USER REGISTRATION
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      address,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

// USER LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// ARTISAN REGISTRATION
export const registerArtisan = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

    const existing = await Artisan.findOne({ email });
    if (existing) return res.status(400).json({ message: "Artisan already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const artisan = await Artisan.create({
      name,
      email,
      passwordHash: hashedPassword,
      bio,
    });

    res.status(201).json({ message: "Artisan registered successfully" });
  } catch (err) {
    next(err);
  }
};

// ARTISAN LOGIN
export const loginArtisan = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const artisan = await Artisan.findOne({ email });
    if (!artisan) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, artisan.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: artisan._id, role: "artisan" }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};