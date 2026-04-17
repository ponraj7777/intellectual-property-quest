import express from 'express';
import {
    registerUser,
    authUser,
    getUserProfile,
    updateProgress,
    addXP,
    getLeaderboard,
    getUserRank,
    updateUserProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/', protect, admin, getUsers);
router.get('/leaderboard', getLeaderboard);
router.get('/profile', protect, getUserProfile);
router.get('/rank', protect, getUserRank);
router.put('/profile', protect, updateUserProfile);
router.put('/progress', protect, updateProgress);
router.put('/xp', protect, addXP);
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
