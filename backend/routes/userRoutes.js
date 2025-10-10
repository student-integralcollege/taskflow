import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateUserProfile, updatePassword } from '../controllers/userController.js';
import authmiddleware from '../middleware/auth.js';

const userRoutes = express.Router();

//public links
userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);

//private links
userRoutes.get('/me', authmiddleware, getCurrentUser);
userRoutes.put('/profile', authmiddleware, updateUserProfile);
userRoutes.put('/password', authmiddleware, updatePassword);

export default userRoutes;