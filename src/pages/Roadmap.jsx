import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Info, Award, Circle, RotateCcw } from 'lucide-react';
import { modulesData } from '../data/modules';
import { useGame } from '../hooks/useGame';
import RoadmapNode from '../components/RoadmapNode';
import RoadmapPath from '../components/RoadmapPath';

const Roadmap = () => {
    const navigate = useNavigate();
    const { completedLevels, isLevelUnlocked, resetProgress } = useGame();
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    const activeModule = modulesData[activeModuleIndex];

    const calculateProgress = (module) => {
        const totalLevels = module.games.length * 3; // 3 difficulties per game
        let completed = 0;

        module.games.forEach((_, gameIndex) => {
            ['easy', 'medium', 'hard'].forEach(diff => {
                if (completedLevels.includes(`${module.id}-${gameIndex}-${diff}`)) {
                    completed++;
                }
            });
        });

        return Math.round((completed / totalLevels) * 100);
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-12 min-h-screen">
            <button
                onClick={() => navigate('/modules')}
                className="inline-flex items-center text-quest-muted hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Modules
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Module Sidebar */}
                <div className="lg:w-1/4 space-y-4">
                    <h2 className="text-xl font-bold mb-6 px-2 uppercase tracking-widest text-quest-muted">Modules</h2>
                    {modulesData.map((module, index) => (
                        <button
                            key={module.id}
                            onClick={() => setActiveModuleIndex(index)}
                            className={`
                                w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between group
                                ${activeModuleIndex === index
                                    ? `bg-white/10 border-quest-primary shadow-lg shadow-quest-primary/10`
                                    : 'bg-white/5 border-transparent hover:bg-white/10'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <module.icon className={`w-5 h-5 ${activeModuleIndex === index ? module.color : 'text-quest-muted'}`} />
                                <span className={activeModuleIndex === index ? 'font-bold' : 'text-quest-muted'}>
                                    {module.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-quest-muted bg-white/5 px-1.5 py-0.5 rounded">
                                    {calculateProgress(module)}%
                                </span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeModuleIndex === index ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
                            </div>
                        </button>
                    ))}

                    <div className="pt-8 mt-8 border-t border-white/10">
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to reset your entire journey? This cannot be undone.")) {
                                    resetProgress();
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset Journey
                        </button>
                    </div>
                </div>

                {/* Roadmap Area */}
                <div className="lg:w-3/4">
                    <motion.div
                        key={activeModule.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 rounded-full ${activeModule.color.replace('text-', 'bg-')}`}></div>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-black mb-4 font-heading">{activeModule.title} Journey</h1>
                            <p className="text-quest-muted max-w-xl text-lg leading-relaxed">
                                {activeModule.description}
                            </p>

                            {/* Overall Progress Bar */}
                            <div className="mt-8 max-w-md">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-quest-muted">Path Progress</span>
                                    <span>{calculateProgress(activeModule)}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${calculateProgress(activeModule)}%` }}
                                        className={`h-full rounded-full bg-gradient-to-r from-quest-primary to-quest-secondary shadow-lg`}
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Level Path - Zig Zag Flow */}
                        <div className="flex flex-col items-center py-10 w-full max-w-[768px] mx-auto overflow-visible">
                            {['easy', 'medium', 'hard'].map((difficulty, index) => {
                                const isLocked = !isLevelUnlocked(activeModule.id, 0, difficulty);
                                const totalInDifficulty = activeModule.games.length;
                                const completedInDifficulty = activeModule.games.filter((_, gIdx) =>
                                    completedLevels.includes(`${activeModule.id}-${gIdx}-${difficulty}`)
                                ).length;

                                const isCompleted = completedInDifficulty === totalInDifficulty;
                                const progress = totalInDifficulty > 0 ? completedInDifficulty / totalInDifficulty : 0;
                                const isEven = index % 2 === 0;

                                return (
                                    <React.Fragment key={difficulty}>
                                        <div className={`flex items-center w-full px-4 md:px-0 relative z-10 justify-start ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                            {/* Node */}
                                            <div className="flex-shrink-0">
                                                <RoadmapNode
                                                    level={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                                    gameTitle={`${completedInDifficulty}/${totalInDifficulty} Challenges`}
                                                    status={{
                                                        isLocked,
                                                        isCompleted,
                                                        progress
                                                    }}
                                                    colorClass={activeModule.color}
                                                    onSelect={() => navigate(`/modules/${activeModule.id}`, { state: { difficulty } })}
                                                />
                                            </div>

                                            {/* Content Block */}
                                            <div className={`
                                                hidden md:block md:w-1/2 px-12 transition-all duration-500
                                                ${isEven ? 'text-left' : 'text-right'}
                                                ${isLocked ? 'opacity-40' : 'opacity-100'}
                                            `}>
                                                <h3 className={`font-bold text-xl mb-2 ${isLocked ? 'text-white/20' : 'text-white'}`}>
                                                    {difficulty.toUpperCase()} MODE
                                                </h3>
                                                <p className={`text-base leading-relaxed ${isLocked ? 'text-white/10' : 'text-quest-muted'}`}>
                                                    {isCompleted
                                                        ? `Mastered all ${difficulty} challenges!`
                                                        : isLocked
                                                            ? `Complete all ${index === 1 ? 'Easy' : 'Medium'} games to unlock.`
                                                            : `Complete ${totalInDifficulty - completedInDifficulty} more to unlock next level.`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Connecting Path */}
                                        {index < 2 && (
                                            <div className="w-full z-0 hidden md:block">
                                                <RoadmapPath
                                                    isCompleted={isCompleted}
                                                    progress={progress}
                                                    isFromLeft={isEven}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Boss Level Callout */}
                        <div className="mt-12 text-center">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-quest-muted text-sm font-medium">
                                <Award className="w-4 h-4" />
                                <span>Complete all difficulties to earn the <strong className="text-white">{activeModule.title} Mastery Badge</strong></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
