import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { modulesData } from '../data/modules';

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

    const isDifficultyUnlocked = (moduleId, difficulty) => {
        // All Easy levels are unlocked by default for every category
        if (difficulty === 'easy') return true;

        const module = modulesData.find(m => m.id === moduleId);
        if (!module) return false;

        if (difficulty === 'medium') {
            // Unlocks if ALL easy games in this module are completed
            return module.games.every((_, index) =>
                completedLevels.includes(`${moduleId}-${index}-easy`)
            );
        }

        if (difficulty === 'hard') {
            // Unlocks if ALL medium games in this module are completed
            return module.games.every((_, index) =>
                completedLevels.includes(`${moduleId}-${index}-medium`)
            );
        }

        return false;
    };

    const isLevelUnlocked = (moduleId, levelIndex, difficulty = 'easy') => {
        // First check if the difficulty itself is unlocked for this module
        return isDifficultyUnlocked(moduleId, difficulty);
    };

    const getNextMilestone = () => {
        const nextLevelXp = level * 1000;
        return { xp: nextLevelXp, label: `Level ${level + 1}` };
    };

    const unlockBadge = (badgeId) => {
        if (!badges.includes(badgeId)) {
            setBadges(prev => [...prev, badgeId]);
            toast.success("New Badge Unlocked!");
        }
    };

    const resetProgress = () => {
        setXp(0);
        setLevel(1);
        setCompletedModules([]);
        setCompletedLevels([]);
        setBadges([]);
        localStorage.removeItem('quest_xp');
        localStorage.removeItem('quest_level');
        localStorage.removeItem('quest_completed_modules');
        localStorage.removeItem('quest_completed_levels');
        localStorage.removeItem('quest_badges');
        toast.info("Journey Reset!");
    };

    return (
        <GameContext.Provider value={{
            user, xp, level, completedModules, completedLevels, badges, XP_THRESHOLDS,
            login, signup, logout, addXp, completeLevel, completeModule, unlockBadge,
            isLevelUnlocked, isDifficultyUnlocked, getNextMilestone, resetProgress
        }}>
            {children}
        </GameContext.Provider>
    );
};
