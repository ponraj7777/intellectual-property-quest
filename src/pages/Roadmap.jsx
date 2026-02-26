import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Info, Award, Circle, RotateCcw, Lock } from 'lucide-react';
import { modulesData } from '../data/modules';
import { useGame } from '../hooks/useGame';
import RoadmapNode from '../components/RoadmapNode';
import RoadmapPath from '../components/RoadmapPath';
import { toast } from 'sonner';

const Roadmap = () => {
    const navigate = useNavigate();
    const { user, completedLevels, isLevelUnlocked, resetProgress } = useGame();
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    const activeModule = modulesData[activeModuleIndex];

    const calculateProgress = (module) => {
        const totalLevels = 9; // 3 difficulties * 3 levels each
        let completed = 0;

        ['easy', 'medium', 'hard'].forEach((diff, dIdx) => {
            const levelRange = dIdx === 0 ? [0, 1, 2] : dIdx === 1 ? [3, 4, 5] : [6, 7, 8];
            levelRange.forEach(lIdx => {
                if (completedLevels.includes(`${module.id}-${lIdx}-${diff}`)) {
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
                className="inline-flex items-center text-quest-muted hover:text-quest-text mb-8 transition-colors group"
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
                                w-full p-4 rounded-xl text-left transition-all duration-300 border-2 flex items-center justify-between group hover:scale-[1.02] active:scale-[0.98]
                                ${activeModuleIndex === index
                                    ? `bg-quest-card border-quest-primary shadow-lg shadow-quest-primary/10`
                                    : 'bg-quest-card/50 border-transparent hover:bg-quest-card'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <module.icon className={`w-5 h-5 ${activeModuleIndex === index ? module.color : 'text-quest-muted'}`} />
                                <span className={activeModuleIndex === index ? 'font-bold' : 'text-quest-muted'}>
                                    {module.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-quest-muted bg-quest-text/5 px-1.5 py-0.5 rounded">
                                    {calculateProgress(module)}%
                                </span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeModuleIndex === index ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
                            </div>
                        </button>
                    ))}

                    <div className="pt-8 mt-8 border-t border-quest-text/10">
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

                            {!user ? (
                                <div className="p-6 bg-quest-primary/10 border border-quest-primary/30 rounded-2xl mb-8 flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <div className="p-3 bg-quest-primary/20 rounded-xl text-quest-primary flex-shrink-0">
                                            <Lock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Quest Access Locked</h4>
                                            <p className="text-sm text-quest-muted">Login to track your progress and unlock new challenges.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                        <Link to="/login" className="px-6 py-2.5 bg-quest-primary text-white rounded-lg font-bold hover:bg-quest-primary/80 transition-all text-center">Login</Link>
                                        <Link to="/signup" className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-center">Join Quest</Link>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-quest-muted max-w-xl text-lg leading-relaxed">
                                    {activeModule.description}
                                </p>
                            )}

                            {/* Overall Progress Bar */}
                            <div className="mt-8 max-w-md">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-quest-muted">Path Progress</span>
                                    <span>{calculateProgress(activeModule)}%</span>
                                </div>
                                <div className="h-3 bg-quest-card rounded-full overflow-hidden p-0.5 border border-quest-text/10">
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
                                const difficultyIndex = index; // 0 for easy, 1 for medium, 2 for hard
                                const levelRange = difficultyIndex === 0 ? [0, 1, 2] : difficultyIndex === 1 ? [3, 4, 5] : [6, 7, 8];

                                const completedInDifficulty = levelRange.filter(lIdx =>
                                    completedLevels.includes(`${activeModule.id}-${lIdx}-${difficulty}`)
                                ).length;

                                const isCompleted = completedInDifficulty === 3;
                                const progress = completedInDifficulty / 3;
                                const isEven = index % 2 === 0;

                                return (
                                    <React.Fragment key={difficulty}>
                                        <div className={`flex items-center w-full px-4 md:px-0 relative z-10 justify-start ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                            {/* Node */}
                                            <div className="flex-shrink-0">
                                                <RoadmapNode
                                                    level={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                                    gameTitle={`${completedInDifficulty}/3 Challenges`}
                                                    status={{
                                                        isLocked,
                                                        isCompleted,
                                                        progress
                                                    }}
                                                    colorClass={activeModule.color}
                                                    onSelect={() => {
                                                        if (!user) {
                                                            toast.error("Protector Check Failed", {
                                                                description: "Please login to embark on this journey node."
                                                            });
                                                            navigate('/login');
                                                            return;
                                                        }
                                                        navigate(`/modules/${activeModule.id}`, { state: { difficulty } });
                                                    }}
                                                />
                                            </div>

                                            {/* Content Block */}
                                            <div className={`
                                                hidden md:block md:w-1/2 px-12 transition-all duration-500
                                                ${isEven ? 'text-left' : 'text-right'}
                                                ${isLocked ? 'opacity-40' : 'opacity-100'}
                                            `}>
                                                <h3 className={`font-bold text-xl mb-2 ${isLocked ? 'text-quest-text/20' : 'text-quest-text'}`}>
                                                    {difficulty.toUpperCase()} MODE
                                                </h3>
                                                <p className={`text-base leading-relaxed ${isLocked ? 'text-quest-text/10' : 'text-quest-muted'}`}>
                                                    {isCompleted
                                                        ? `Mastered all ${difficulty} challenges!`
                                                        : isLocked
                                                            ? `Complete all ${index === 1 ? 'Easy' : 'Medium'} games to unlock.`
                                                            : `Complete ${3 - completedInDifficulty} more to unlock next level.`}
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
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-quest-card border border-quest-text/10 rounded-full text-quest-muted text-sm font-medium">
                                <Award className="w-4 h-4" />
                                <span>Complete all difficulties to earn the <strong className="text-quest-text">{activeModule.title} Mastery Badge</strong></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
