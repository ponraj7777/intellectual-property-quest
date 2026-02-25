import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateProgress,
    addXP,
    getLeaderboard,
    getUserRank
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/leaderboard', getLeaderboard);
router.get('/profile', protect, getUserProfile);
router.get('/rank', protect, getUserRank);
router.put('/progress', protect, updateProgress);
router.put('/xp', protect, addXP);

export default router;
