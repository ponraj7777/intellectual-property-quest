import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('quest_xp')) || 0);
    const [level, setLevel] = useState(() => parseInt(localStorage.getItem('quest_level')) || 1);
    const [completedModules, setCompletedModules] = useState(() =>
        JSON.parse(localStorage.getItem('quest_completed_modules')) || []
    );
    const [badges, setBadges] = useState(() =>
        JSON.parse(localStorage.getItem('quest_badges')) || []
    );

    useEffect(() => {
        localStorage.setItem('quest_xp', xp);
        localStorage.setItem('quest_level', level);
        localStorage.setItem('quest_completed_modules', JSON.stringify(completedModules));
        localStorage.setItem('quest_badges', JSON.stringify(badges));
    }, [xp, level, completedModules, badges]);

    const addXp = (amount) => {
        setXp(prev => {
            const newXp = prev + amount;
            // Simple leveling logic: Level up every 1000 XP
            const newLevel = Math.floor(newXp / 1000) + 1;
            if (newLevel > level) {
                setLevel(newLevel);
                // You would emit a level up event/toast here
            }
            return newXp;
        });
    };

    const completeModule = (moduleId) => {
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId]);
            addXp(500); // Bonus for completing module
            // Award Badge logic could go here
        }
    };

    const unlockBadge = (badgeId) => {
        if (!badges.includes(badgeId)) {
            setBadges(prev => [...prev, badgeId]);
        }
    }

    return (
        <GameContext.Provider value={{ xp, level, completedModules, badges, addXp, completeModule, unlockBadge }}>
            {children}
        </GameContext.Provider>
    );
};
