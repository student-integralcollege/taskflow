import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';
const TOKEN_EXPIRES_IN = '24h';

const createToken = (userid) => jwt.sign({ id: userid }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

// Register User
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const registerUser = await User.create({ name, email, password: hashed });
        const token = createToken(registerUser._id);
        res.status(201).json({ success: true, token, user: { id: registerUser._id, name: registerUser.name, email: registerUser.email } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


// Login User
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const loginUser = await User.findOne({ email });
        if (!loginUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, loginUser.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = createToken(loginUser._id);
        res.status(200).json({ success: true, token, user: { id: loginUser._id, name: loginUser.name, email: loginUser.email } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


// Get Current User
export async function getCurrentUser(req, res) {
    try {
        const foundUser = await User.findById(req.user.id).select('name email');
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: foundUser });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


// Update User Profile
export async function updateUserProfile(req, res) {
    const { name, email } = req.body;
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Name and valid email are required' });
    }
    try {
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use by another account.' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('name email');
        res.json({ success: true, user: updatedUser });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Change Password
export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Password invalid or too short' });
    }

    try {
        const user = await User.findById(req.user.id).select('password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}