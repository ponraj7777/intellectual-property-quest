import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronRight } from 'lucide-react';

const RoadmapNode = ({ level, gameTitle, difficulties, onSelectDifficulty, colorClass }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const difficultyLevels = ['easy', 'medium', 'hard'];

    return (
        <div className="relative flex flex-col items-center">
            <motion.div
                className="relative z-10"
                onHoverStart={() => setIsExpanded(true)}
                onHoverEnd={() => setIsExpanded(false)}
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`
                        w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative
                        ${difficultyLevels.every(d => difficulties[d].isCompleted)
                            ? `bg-white/10 ${colorClass.replace('text-', 'border-')} border-solid shadow-xl shadow-${colorClass.split('-')[1]}-500/40`
                            : `bg-white/5 border-white/20 hover:border-${colorClass.split('-')[1]}-400`
                        }
                    `}
                >
                    <span className="text-xl font-bold">{level}</span>

                    {/* Completion Ring */}
                    <svg className="absolute inset-0 -rotate-90 w-full h-full p-1 overflow-visible">
                        <circle
                            cx="28" cy="28" r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-white/5"
                        />
                        <circle
                            cx="28" cy="28" r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - (difficultyLevels.filter(d => difficulties[d].isCompleted).length / 3))}
                            className={colorClass}
                        />
                    </svg>
                </motion.button>

                {/* Difficulty Expanded Menu */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2 p-2 glass-panel rounded-2xl min-w-[140px] shadow-2xl"
                        >
                            {difficultyLevels.map((diff) => {
                                const status = difficulties[diff];
                                return (
                                    <button
                                        key={diff}
                                        disabled={status.isLocked}
                                        onClick={() => onSelectDifficulty(diff)}
                                        className={`
                                            flex items-center justify-between p-2.5 rounded-xl transition-all
                                            ${status.isLocked
                                                ? 'opacity-40 grayscale cursor-not-allowed bg-black/20'
                                                : status.isCompleted
                                                    ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                                                    : 'bg-white/5 hover:bg-white/10 hover:text-white text-quest-muted'}
                                        `}
                                    >
                                        <div className="flex flex-col items-start px-1">
                                            <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">
                                                {diff}
                                            </span>
                                            {status.isLocked && (
                                                <span className="text-[8px] font-bold text-quest-primary">
                                                    {status.xpRequired} XP
                                                </span>
                                            )}
                                        </div>
                                        {status.isLocked ? (
                                            <Lock className="w-3 h-3 opacity-50" />
                                        ) : status.isCompleted ? (
                                            <div className="bg-green-500/20 p-1 rounded-full">
                                                <Check className="w-3 h-3 text-green-500" />
                                            </div>
                                        ) : (
                                            <ChevronRight className="w-3 h-3 opacity-30" />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-quest-muted">
                {gameTitle}
            </span>
        </div>
    );
};

export default RoadmapNode;
