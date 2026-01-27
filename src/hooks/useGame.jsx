import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const XP_THRESHOLDS = {
        easy: 0,
        medium: 1500,
        hard: 4000
    };

    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('quest_xp')) || 0);
    const [level, setLevel] = useState(() => parseInt(localStorage.getItem('quest_level')) || 1);
    const [completedModules, setCompletedModules] = useState(() =>
        JSON.parse(localStorage.getItem('quest_completed_modules')) || []
    );
    const [completedLevels, setCompletedLevels] = useState(() =>
        JSON.parse(localStorage.getItem('quest_completed_levels')) || []
    );
    const [badges, setBadges] = useState(() =>
        JSON.parse(localStorage.getItem('quest_badges')) || []
    );

    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('quest_user')) || null
    );

    useEffect(() => {
        localStorage.setItem('quest_xp', xp);
        localStorage.setItem('quest_level', level);
        localStorage.setItem('quest_completed_modules', JSON.stringify(completedModules));
        localStorage.setItem('quest_completed_levels', JSON.stringify(completedLevels));
        localStorage.setItem('quest_badges', JSON.stringify(badges));
        localStorage.setItem('quest_user', JSON.stringify(user));
    }, [xp, level, completedModules, completedLevels, badges, user]);

    const login = (userData) => {
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
    };

    const signup = (userData) => {
        setUser(userData);
        toast.success(`Account created! Welcome, ${userData.name}!`);
    };

    const logout = () => {
        setUser(null);
        toast.info("Signed out successfully.");
    };

    const addXp = (amount) => {
        setXp(prev => {
            const newXp = prev + amount;
            const newLevel = Math.floor(newXp / 1000) + 1;

            // Notification for XP threshold unlocks
            if (prev < XP_THRESHOLDS.medium && newXp >= XP_THRESHOLDS.medium) {
                toast.success("🔥 ADVANCED CHALLENGE UNLOCKED: Medium difficulty is now available!");
            }
            if (prev < XP_THRESHOLDS.hard && newXp >= XP_THRESHOLDS.hard) {
                toast.success("💎 ELITE CHALLENGE UNLOCKED: Hard difficulty is now available!");
            }

            if (newLevel > level) {
                setLevel(newLevel);
                toast.success(`Level Up! You are now Level ${newLevel}`);
            }
            return newXp;
        });
    };

    const completeLevel = (moduleId, levelIndex, difficulty = 'easy') => {
        const levelId = `${moduleId}-${levelIndex}-${difficulty}`;
        if (!completedLevels.includes(levelId)) {
            setCompletedLevels(prev => [...prev, levelId]);

            // Award XP based on difficulty
            const rewards = { easy: 100, medium: 250, hard: 500 };
            addXp(rewards[difficulty] || 100);
            toast.success(`${difficulty.toUpperCase()} level cleared! +${rewards[difficulty]} XP`);
        } else {
            toast.info("Level completed again! (No extra XP earned)");
        }
    };

    const completeModule = (moduleId) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId]);
            addXp(1000); // Increased reward for full module mastery
            toast.success("🏆 Module Mastery! +1000 XP");
        }
    };

    const isDifficultyUnlocked = (difficulty) => {
        return xp >= XP_THRESHOLDS[difficulty];
    };

    const isLevelUnlocked = (moduleId, levelIndex, difficulty = 'easy') => {
        // Global XP check for difficulty
        if (!isDifficultyUnlocked(difficulty)) return false;

        // All Easy levels are unlocked by default
        if (difficulty === 'easy') return true;

        // Within game sequential check (Easy -> Medium -> Hard)
        if (difficulty === 'medium') {
            return completedLevels.includes(`${moduleId}-${levelIndex}-easy`);
        }
        if (difficulty === 'hard') {
            return completedLevels.includes(`${moduleId}-${levelIndex}-medium`);
        }

        return false;
    };

    const getNextMilestone = () => {
        if (xp < XP_THRESHOLDS.medium) return { xp: XP_THRESHOLDS.medium, label: 'Medium' };
        if (xp < XP_THRESHOLDS.hard) return { xp: XP_THRESHOLDS.hard, label: 'Hard' };
        return null;
    };

    const unlockBadge = (badgeId) => {
        if (!badges.includes(badgeId)) {
            setBadges(prev => [...prev, badgeId]);
            toast.success("New Badge Unlocked!");
        }
    }

    return (
        <GameContext.Provider value={{
            user, xp, level, completedModules, completedLevels, badges, XP_THRESHOLDS,
            login, signup, logout, addXp, completeLevel, completeModule, unlockBadge,
            isLevelUnlocked, isDifficultyUnlocked, getNextMilestone
        }}>
            {children}
        </GameContext.Provider>
    );
};
