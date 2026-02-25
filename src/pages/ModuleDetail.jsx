import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, BookOpen, Award, ChevronRight, Calculator, List, RotateCw, HelpCircle, Lock, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from '../components/Quiz';
import SpeedSorter from '../components/SpeedSorter';
import TermMatch from '../components/TermMatch';
import SpinWheel from '../components/SpinWheel';
import GuessTheIP from '../components/GuessTheIP';
import Snakeandladder from '../components/Snakeandladder';
import ArcheryGame from '../components/ArcheryGame';
import ReverseHangman from '../components/ReverseHangman';
import PatentPresentation from '../components/PatentPresentation';
import { useGame } from '../hooks/useGame';

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const location = useLocation();
    const module = modulesData.find(m => m.id === moduleId);
    const { user, completedModules, isLevelUnlocked, completedLevels } = useGame();

    const [activeGameIndex, setActiveGameIndex] = useState(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [showSlides, setShowSlides] = useState(false);

    useEffect(() => {
        if (location.state?.activeLevel !== undefined) {
            setActiveGameIndex(location.state.activeLevel);
        }
        if (location.state?.difficulty) {
            setDifficulty(location.state.difficulty);
        }
    }, [location.state]);

    const isModuleCompleted = module && completedModules.includes(module.id);

    if (!module) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Module Not Found</h2>
                <Link to="/roadmap" className="text-quest-primary hover:underline">Back to Journey</Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 pt-40 pb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-12 rounded-3xl max-w-lg mx-auto border-quest-primary/20"
                >
                    <div className="w-20 h-20 rounded-full bg-quest-primary/10 flex items-center justify-center mx-auto mb-8">
                        <Lock className="w-10 h-10 text-quest-primary" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold mb-4">Guardian Authentication Required</h2>
                    <p className="text-quest-muted mb-8 leading-relaxed">
                        To access the training vaults and earn XP, you must be a registered Protector.
                        Join the IP Quest to save inventors and claim your rank on the leaderboard!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="btn-primary px-8 py-3">Login</Link>
                        <Link to="/signup" className="px-8 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Sign Up</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const activeGame = activeGameIndex !== null ? module.games[activeGameIndex] : null;

    return (
        <div className="container mx-auto px-4 pt-32 pb-12">
            <Link to="/roadmap" className="inline-flex items-center text-quest-muted hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journey
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <div className="glass-panel p-6 rounded-xl sticky top-24">
                        <div className={`p-4 rounded-xl bg-white/5 w-fit mb-6`}>
                            <module.icon className={`w-12 h-12 ${module.color}`} />
                        </div>
                        <h1 className="text-3xl font-heading font-bold mb-4">{module.title}</h1>
                        <p className="text-quest-muted mb-6 leading-relaxed">
                            {module.description}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center text-sm text-quest-muted">
                                < BookOpen className="w-4 h-4 mr-3" />
                                <span>{module.games.length} Challenge Nodes</span>
                            </div>
                            <div className="flex items-center text-sm text-quest-muted">
                                <Award className={`w-4 h-4 mr-3 ${isModuleCompleted ? 'text-yellow-500' : ''}`} />
                                <span>{isModuleCompleted ? 'Module Mastery Earned' : 'Complete all to Earn Badge'}</span>
                            </div>
                        </div>

                        {activeGameIndex !== null && (
                            <button
                                onClick={() => setActiveGameIndex(null)}
                                className="w-full py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm"
                            >
                                Explorer Mode (All Levels)
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {activeGameIndex === null ? (
                        <div className="space-y-6">
                            <div className="space-y-6">
                                {!showSlides && (
                                    <button
                                        onClick={() => setShowSlides(true)}
                                        className="w-full glass-panel p-6 rounded-xl text-left transition-all hover:border-quest-primary/50 group flex items-center justify-between bg-quest-primary/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 rounded-xl bg-quest-primary/20 text-quest-primary">
                                                < BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-quest-primary">Recommended</span>
                                                </div>
                                                <h3 className="text-lg font-bold group-hover:text-quest-primary transition-colors">Start Learning Guide</h3>
                                                <p className="text-sm text-quest-muted">New to {module.title.toLowerCase()}? Learn the basics in 5 simple slides.</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-quest-muted group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                                <AnimatePresence>
                                    {showSlides && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="overflow-hidden"
                                        >
                                            <PatentPresentation onClose={() => setShowSlides(false)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!showSlides && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold uppercase tracking-wider">Level Select</h2>
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                            {['easy', 'medium', 'hard'].map((d) => (
                                                <button
                                                    key={d}
                                                    onClick={() => setDifficulty(d)}
                                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                                        ${difficulty === d ? 'bg-quest-primary text-white shadow-lg' : 'text-quest-muted hover:text-white'}
                                                    `}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {module.games.map((game, index) => {
                                            const unlocked = isLevelUnlocked(module.id, index, difficulty);
                                            return (
                                                <button
                                                    key={index}
                                                    disabled={!unlocked}
                                                    onClick={() => setActiveGameIndex(index)}
                                                    className={`glass-panel p-6 rounded-xl text-left transition-all group flex items-center justify-between
                                                        ${unlocked ? 'hover:border-quest-primary/50' : 'opacity-60 grayscale cursor-not-allowed'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-4 rounded-xl ${!unlocked ? 'bg-white/5 text-white/20' :
                                                            game.type === 'quiz' ? 'bg-blue-500/20 text-blue-400' :
                                                                game.type === 'sorter' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    game.type === 'match' ? 'bg-purple-500/20 text-purple-400' :
                                                                        game.type === 'spin' ? 'bg-orange-500/20 text-orange-400' :
                                                                            game.type === 'snake' ? 'bg-amber-500/20 text-amber-400' :
                                                                                'bg-pink-500/20 text-pink-400'
                                                            }`}>
                                                            {!unlocked ? <Lock className="w-6 h-6" /> : (
                                                                <>
                                                                    {game.type === 'quiz' && <List className="w-6 h-6" />}
                                                                    {game.type === 'sorter' && <Calculator className="w-6 h-6" />}
                                                                    {game.type === 'match' && <List className="w-6 h-6" />}
                                                                    {game.type === 'spin' && <RotateCw className="w-6 h-6" />}
                                                                    {game.type === 'guess' && <HelpCircle className="w-6 h-6" />}
                                                                    {game.type === 'snake' && <Trophy className="w-6 h-6" />}
                                                                    {game.type === 'archery' && <Target className="w-6 h-6" />}
                                                                    {game.type === 'reverse-hangman' && <Target className="w-6 h-6" />}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-quest-muted">Challenge {index + 1}</span>
                                                                {completedLevels.includes(`${module.id}-${index}-${difficulty}`) ? (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-green-500/20 text-green-400">
                                                                        Completed
                                                                    </span>
                                                                ) : (
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${!unlocked ? 'bg-red-500/10 text-red-400' : 'bg-quest-primary/10 text-quest-primary'
                                                                        }`}>
                                                                        {difficulty} {unlocked ? 'Unlocked' : 'Locked'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className={`text-lg font-bold transition-colors ${unlocked ? 'group-hover:text-quest-primary' : 'text-white/30'}`}>
                                                                {game.title}
                                                            </h3>
                                                            <p className="text-sm text-quest-muted">
                                                                {completedLevels.includes(`${module.id}-${index}-${difficulty}`)
                                                                    ? 'Challenge mastered!'
                                                                    : unlocked
                                                                        ? game.description
                                                                        : 'Complete previous difficulty to unlock'
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {unlocked && <ChevronRight className="w-5 h-5 text-quest-muted group-hover:translate-x-1 transition-transform" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Active Game Screen
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-quest-muted text-sm">
                                    <span
                                        onClick={() => setActiveGameIndex(null)}
                                        className="cursor-pointer hover:text-white hover:underline"
                                    >
                                        Back to Select
                                    </span>
                                    <ChevronRight className="w-3 h-3" />
                                    <span className="text-quest-primary">{activeGame.title}</span>
                                    <div className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-quest-primary/30 text-quest-primary`}>
                                        {difficulty}
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-quest-muted uppercase tracking-wider">Node {activeGameIndex + 1} of {module.games.length}</div>
                            </div>

                            {activeGame.type === 'quiz' && (
                                <Quiz questions={activeGame.data.questions} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'sorter' && (
                                <SpeedSorter gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'match' && (
                                <TermMatch gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'spin' && (
                                <SpinWheel gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'guess' && (
                                <GuessTheIP gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'snake' && (
                                <Snakeandladder gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'archery' && (
                                <ArcheryGame gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                            {activeGame.type === 'reverse-hangman' && (
                                <ReverseHangman gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={difficulty} />
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ModuleDetail;
