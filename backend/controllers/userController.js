import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkNewBadges } from '../utils/badgeRules.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, dob } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password, // Hashing is handled by User model pre-save hook
        xp: 0,
        level: 1,
        completedLevels: [],
        dob: dob || '2000-01-01'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            xp: user.xp,
            level: user.level,
            completedLevels: user.completedLevels,
            dob: user.dob,
            joinedAt: user.createdAt,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            xp: user.xp,
            level: user.level,
            completedLevels: user.completedLevels,
            dob: user.dob,
            joinedAt: user.createdAt,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            xp: user.xp,
            level: user.level,
            completedLevels: user.completedLevels,
            dob: user.dob,
            joinedAt: user.createdAt,
            profilePic: user.profilePic,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user progress (complete a level)
// @route   PUT /api/users/progress
// @access  Private
const updateProgress = async (req, res) => {
    const { moduleId, levelIndex, difficulty } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const alreadyCompleted = user.completedLevels.find(
            (l) => l.moduleId === moduleId && l.levelIndex === levelIndex && l.difficulty === difficulty
        );

        if (!alreadyCompleted) {
            user.completedLevels.push({ moduleId, levelIndex, difficulty });
        }

        // Always check for new badges (handles retroactive awards)
        const newBadges = checkNewBadges(user);
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();
        res.json({
            message: alreadyCompleted ? 'Already completed' : 'Progress updated',
            completedLevels: user.completedLevels,
            badges: user.badges,
            newBadges: newBadges,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Add XP to user
// @route   PUT /api/users/xp
// @access  Private
const addXP = async (req, res) => {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const xpToAdd = Number(amount) || 0;
        user.xp = (user.xp || 0) + xpToAdd;
        const newLevel = Math.floor(user.xp / 1000) + 1;

        if (newLevel > (user.level || 1)) {
            user.level = newLevel;
        }

        // Check for new badges
        const newBadges = checkNewBadges(user);
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();
        res.json({
            xp: user.xp,
            level: user.level,
            name: user.name,
            email: user.email,
            completedLevels: user.completedLevels,
            badges: user.badges,
            newBadges: newBadges,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get current user's rank
// @route   GET /api/users/rank
// @access  Private
const getUserRank = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Count users with more XP who are not admins
        const rank = await User.countDocuments({ xp: { $gt: user.xp }, isAdmin: { $ne: true } }) + 1;

        res.json({
            rank,
            xp: user.xp,
            level: user.level,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rank' });
    }
};

// @desc    Get top users for leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const topUsers = await User.find({ isAdmin: { $ne: true } })
            .sort({ xp: -1, level: -1 })
            .limit(10)
            .select('name xp level profilePic badges');
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.dob = req.body.dob || user.dob;
        if (req.body.profilePic) {
            user.profilePic = req.body.profilePic;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            xp: updatedUser.xp,
            level: updatedUser.level,
            completedLevels: updatedUser.completedLevels,
            dob: updatedUser.dob,
            joinedAt: updatedUser.createdAt,
            profilePic: updatedUser.profilePic,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.xp = req.body.xp !== undefined ? req.body.xp : user.xp;
            user.level = req.body.level !== undefined ? req.body.level : user.level;
            
            if (req.body.isAdmin !== undefined) {
                user.isAdmin = req.body.isAdmin;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                xp: updatedUser.xp,
                level: updatedUser.level
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

export { registerUser, authUser, getUserProfile, updateProgress, addXP, getLeaderboard, getUserRank, updateUserProfile, getUsers, getUserById, updateUser, deleteUser };
