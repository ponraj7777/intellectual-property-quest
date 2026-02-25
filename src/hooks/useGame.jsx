import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { modulesData } from '../data/modules';
import api from '../utils/api';

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

    // Sync state to local storage
    useEffect(() => {
        localStorage.setItem('quest_xp', xp);
        localStorage.setItem('quest_level', level);
        localStorage.setItem('quest_completed_modules', JSON.stringify(completedModules));
        localStorage.setItem('quest_completed_levels', JSON.stringify(completedLevels));
        localStorage.setItem('quest_badges', JSON.stringify(badges));
        localStorage.setItem('quest_user', JSON.stringify(user));
    }, [xp, level, completedModules, completedLevels, badges, user]);

    // Load profile from backend on mount if token exists
    useEffect(() => {
        const syncProfile = async () => {
            if (user?.token) {
                try {
                    const profile = await api.getProfile(user.token);

                    // Only update local XP/Level if backend has higher values 
                    // or if local is 0 (prevents stale backend data from wiping guest progress before sync)
                    if (profile.xp > xp || xp === 0) {
                        setXp(profile.xp);
                        setLevel(profile.level);
                    } else if (xp > profile.xp) {
                        // If local XP is higher (e.g. just finished a game as guest then logged in)
                        // Sync the local XP to the backend
                        const diff = xp - profile.xp;
                        await api.addXP(user.token, diff);
                    }

                    // Match backend format [ {moduleId, levelIndex, difficulty} ] to frontend format [ "moduleId-levelIndex-difficulty" ]
                    if (profile.completedLevels) {
                        const formattedCompletedLevels = profile.completedLevels.map(
                            l => `${l.moduleId}-${l.levelIndex}-${l.difficulty}`
                        );

                        // Merge local and backend completed levels
                        setCompletedLevels(prev => {
                            const combined = [...new Set([...prev, ...formattedCompletedLevels])];
                            return combined;
                        });
                    }
                } catch (error) {
                    console.error("Failed to sync profile:", error);
                }
            }
        };
        syncProfile();
    }, [user?.token]);

    const loginUser = async (email, password) => {
        try {
            const data = await api.login(email, password);
            processUserData(data);
            toast.success(`Welcome back, ${data.name}!`);
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const signupUser = async (name, email, password) => {
        try {
            const data = await api.register(name, email, password);
            processUserData(data);
            toast.success(`Account created! Welcome, ${data.name}!`);
            return data;
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const processUserData = (data) => {
        const token = data.token || user?.token;
        const updatedData = { ...data, token };

        // Merge guest XP if it exists and is higher than account XP
        const localXp = parseInt(localStorage.getItem('quest_xp')) || 0;
        if (localXp > (data.xp || 0)) {
            const diff = localXp - (data.xp || 0);
            if (token) {
                api.addXP(token, diff).catch(err => console.error("Migration failed:", err));
            }
            updatedData.xp = localXp;
            updatedData.level = Math.floor(localXp / 1000) + 1;
        }

        setUser(updatedData);
        if (updatedData.xp !== undefined) setXp(updatedData.xp);
        if (updatedData.level !== undefined) setLevel(updatedData.level);

        if (data.completedLevels) {
            const formatted = data.completedLevels.map(
                l => typeof l === 'string' ? l : `${l.moduleId}-${l.levelIndex}-${l.difficulty}`
            );
            setCompletedLevels(prev => [...new Set([...prev, ...formatted])]);
        }
    };

    const logout = () => {
        setUser(null);
        setXp(0);
        setLevel(1);
        setCompletedLevels([]);
        setCompletedModules([]);
        localStorage.removeItem('quest_xp');
        localStorage.removeItem('quest_level');
        localStorage.removeItem('quest_completed_modules');
        localStorage.removeItem('quest_completed_levels');
        localStorage.removeItem('quest_badges');
        localStorage.removeItem('quest_user');
        toast.info("Signed out successfully.");
    };

    const addXp = async (amount) => {
        setXp(prev => {
            const newXp = prev + amount;
            const newLevel = Math.floor(newXp / 1000) + 1;

            if (newLevel > level) {
                setLevel(newLevel);
                toast.success(`Level Up! You are now Level ${newLevel}`);
            }
            return newXp;
        });

        if (user?.token) {
            try {
                await api.addXP(user.token, amount);
            } catch (error) {
                console.error("Failed to update XP on server:", error);
            }
        }
    };

    const completeLevel = async (moduleId, levelIndex, difficulty = 'easy') => {
        const levelId = `${moduleId}-${levelIndex}-${difficulty}`;
        if (!completedLevels.includes(levelId)) {
            setCompletedLevels(prev => [...prev, levelId]);

            // Award XP based on difficulty
            const rewards = { easy: 100, medium: 250, hard: 500 };
            const amount = rewards[difficulty] || 100;
            addXp(amount);
            toast.success(`${difficulty.toUpperCase()} level cleared! +${amount} XP`);

            if (user?.token) {
                try {
                    await api.updateProgress(user.token, moduleId, levelIndex, difficulty);
                } catch (error) {
                    console.error("Failed to update progress on server:", error);
                }
            }
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
            login: loginUser, signup: signupUser, logout, addXp, completeLevel, completeModule, unlockBadge,
            isLevelUnlocked, isDifficultyUnlocked, getNextMilestone, resetProgress
        }}>
            {children}
        </GameContext.Provider>
    );
};
