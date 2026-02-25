import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className="relative p-2 rounded-xl bg-quest-card/50 border border-quest-text/10 hover:border-quest-primary/30 transition-all duration-300 group overflow-hidden"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <AnimatePresence mode="wait">
                    {isDarkMode ? (
                        <motion.div
                            key="moon"
                            initial={{ y: 20, opacity: 0, rotate: -45 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.3, ease: 'backOut' }}
                        >
                            <Moon className="w-6 h-6 text-quest-primary" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: 20, opacity: 0, rotate: -45 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: -20, opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.3, ease: 'backOut' }}
                        >
                            <Sun className="w-6 h-6 text-quest-primary" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className="absolute inset-0 bg-quest-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
            />
        </button>
    );
};

export default ThemeToggle;
