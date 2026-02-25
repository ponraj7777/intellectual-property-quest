import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronRight } from 'lucide-react';

const RoadmapNode = ({ level, gameTitle, status, onSelect, colorClass }) => {
    const { isLocked, isCompleted, progress } = status;

    return (
        <div className="relative flex flex-col items-center">
            <motion.div className="relative z-10">
                <motion.button
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={!isLocked ? onSelect : undefined}
                    className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative
                        ${isCompleted
                            ? `bg-quest-card border-current ${colorClass} shadow-xl opacity-100`
                            : isLocked
                                ? 'bg-quest-card/10 border-quest-text/10 opacity-60 cursor-not-allowed'
                                : `bg-quest-card/50 border-quest-text/20 hover:border-current hover:${colorClass} opacity-100`
                        }
                    `}
                >
                    {isLocked ? (
                        <Lock className="w-6 h-6 text-quest-text/40" />
                    ) : (
                        <span className="text-sm font-black uppercase tracking-tighter text-quest-text">{level.substring(0, 1)}</span>
                    )}

                    {/* Completion Ring */}
                    <svg className="absolute inset-0 -rotate-90 w-full h-full p-1 overflow-visible">
                        <circle
                            cx="28" cy="28" r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-quest-text/5"
                        />
                        <motion.circle
                            cx="28" cy="28" r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 28}
                            animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - progress) }}
                            className={colorClass}
                        />
                    </svg>
                </motion.button>
            </motion.div>

            {/* Labels - Absolute positioned to not interfere with Path spacing */}
            <div className={`absolute top-20 flex flex-col items-center pointer-events-none w-max transition-opacity duration-500 ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-quest-muted">
                    {level}
                </span>
                <span className="text-[8px] font-bold text-quest-primary/60 uppercase">
                    {gameTitle}
                </span>
            </div>
        </div>
    );
};

export default RoadmapNode;
