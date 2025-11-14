import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export default async function authmiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not Authorized token is missing' });
    }
    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const foundUser = await User.findById(payload.id).select('-password');
        if (!foundUser) {
            return res.status(401).json({ message: 'Not Authorized user not found' });
        }
        req.user = foundUser;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
}