import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, BookOpen, Award, ChevronRight, Calculator, List, RotateCw, HelpCircle, Lock, Trophy, Target, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from '../components/Quiz';
import SpeedSorter from '../components/SpeedSorter';
import TermMatch from '../components/TermMatch';
import SpinWheel from '../components/SpinWheel';
import GuessTheIP from '../components/GuessTheIP';
import Snakeandladder from '../components/Snakeandladder';
import ArcheryGame from '../components/ArcheryGame';
import ReverseHangman from '../components/ReverseHangman';
import MemoryMatch from '../components/MemoryMatch';
import ModulePresentation from '../components/ModulePresentation';
import { useGame } from '../hooks/useGame';

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const location = useLocation();
    const module = modulesData.find(m => m.id === moduleId);
    const { user, completedModules, isLevelUnlocked, completedLevels } = useGame();

    const [activeGameIndex, setActiveGameIndex] = useState(null);
    const [dynamicGames, setDynamicGames] = useState([]);
    const [showSlides, setShowSlides] = useState(false);
    useEffect(() => {
        if (location.state?.activeLevel !== undefined) {
            setActiveGameIndex(location.state.activeLevel);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchDynamicQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/questions/${moduleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setDynamicGames(data);
                }
            } catch (error) {
                console.error('Error fetching dynamic questions:', error);
            }
        };
        if (moduleId) fetchDynamicQuestions();
    }, [moduleId]);

    // Merge static and dynamic games
    const allGames = (() => {
        const games = module ? JSON.parse(JSON.stringify(module.games)) : [];
        const appends = [];

        dynamicGames.forEach(dg => {
            if (dg.levelIndex >= 0 && dg.levelIndex < games.length) {
                const targetGame = games[dg.levelIndex];
                if (targetGame.type === dg.gameType) {
                    if (['quiz', 'reverse-hangman', 'archery', 'snake'].includes(dg.gameType)) {
                        targetGame.data.questions = [
                            ...(targetGame.data.questions || []),
                            ...(dg.data.questions || [])
                        ];
                    } else if (dg.gameType === 'sorter') {
                        targetGame.data.items = [
                            ...(targetGame.data.items || []),
                            ...(dg.data.items || [])
                        ];
                    } else if (dg.gameType === 'match' || dg.gameType === 'memory') {
                        targetGame.data.pairs = [
                            ...(targetGame.data.pairs || []),
                            ...(dg.data.pairs || [])
                        ];
                    } else if (dg.gameType === 'spin') {
                        targetGame.data.segments = [
                            ...(targetGame.data.segments || []),
                            ...(dg.data.segments || [])
                        ];
                    } else if (dg.gameType === 'guess') {
                        targetGame.data.scenarios = [
                            ...(targetGame.data.scenarios || []),
                            ...(dg.data.scenarios || [])
                        ];
                        const existingChars = targetGame.data.characters || [];
                        const newChars = dg.data.characters || [];
                        const mergedChars = [...existingChars];
                        newChars.forEach(nc => {
                            if (!mergedChars.find(c => c.id === nc.id)) {
                                mergedChars.push(nc);
                            }
                        });
                        targetGame.data.characters = mergedChars;
                    }
                } else {
                    // Replace for other types if mismatch manually appended
                    games[dg.levelIndex] = dg;
                }
            } else {
                appends.push(dg);
            }
        });

        return [...games, ...appends];
    })();

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

    const activeGame = activeGameIndex !== null ? allGames[activeGameIndex] : null;
    const activeDifficulty = activeGameIndex !== null ? (
        activeGameIndex <= 2 ? 'easy' :
            activeGameIndex <= 5 ? 'medium' :
                activeGameIndex <= 8 ? 'hard' :
                    (allGames[activeGameIndex].difficulty || 'easy')
    ) : 'easy';

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
                                <span>{allGames.length} Challenge Nodes</span>
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
                                            <ModulePresentation moduleId={moduleId} onClose={() => setShowSlides(false)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!showSlides && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold uppercase tracking-wider">Level Select</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {allGames.map((game, index) => {
                                            const getDifficulty = (idx, g) => {
                                                if (idx <= 2) return 'easy';
                                                if (idx <= 5) return 'medium';
                                                if (idx <= 8) return 'hard';
                                                return g.difficulty || 'easy';
                                            };
                                            const diff = getDifficulty(index, game);
                                            const unlocked = isLevelUnlocked(module.id, index, diff);
                                            return (
                                                <button
                                                    key={game._id || index}
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
                                                                                game.type === 'memory' ? 'bg-indigo-500/20 text-indigo-400' :
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
                                                                    {game.type === 'memory' && <GripHorizontal className="w-6 h-6" />}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-quest-muted">Level {index + 1}</span>
                                                                {completedLevels.includes(`${module.id}-${index}-${diff}`) ? (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-green-500/20 text-green-400">
                                                                        Completed
                                                                    </span>
                                                                ) : (
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${!unlocked ? 'bg-red-500/10 text-red-400' : 'bg-quest-primary/10 text-quest-primary'
                                                                        }`}>
                                                                        {diff} {unlocked ? 'Unlocked' : 'Locked'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h3 className={`text-lg font-bold transition-colors ${unlocked ? 'group-hover:text-quest-primary' : 'text-white/30'}`}>
                                                                {game.title}
                                                            </h3>
                                                            <p className="text-sm text-quest-muted">
                                                                {completedLevels.includes(`${module.id}-${index}-${diff}`)
                                                                    ? 'Challenge mastered!'
                                                                    : unlocked
                                                                        ? game.description
                                                                        : 'Complete previous levels to unlock'
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
                                        {activeDifficulty}
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-quest-muted uppercase tracking-wider">Node {activeGameIndex + 1} of {allGames.length}</div>
                            </div>

                            {activeGame.type === 'quiz' && (
                                <Quiz questions={activeGame.data.questions} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'sorter' && (
                                <SpeedSorter gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'match' && (
                                <TermMatch gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'spin' && (
                                <SpinWheel gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'guess' && (
                                <GuessTheIP gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'snake' && (
                                <Snakeandladder gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'archery' && (
                                <ArcheryGame gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'reverse-hangman' && (
                                <ReverseHangman gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                            {activeGame.type === 'memory' && (
                                <MemoryMatch gameData={activeGame.data} moduleId={module.id} levelIndex={activeGameIndex} difficulty={activeDifficulty} />
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ModuleDetail;
