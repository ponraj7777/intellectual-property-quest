import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, BookOpen, Clock, Award, Play, ChevronRight, Calculator, List, RotateCw, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Quiz from '../components/Quiz';
import SpeedSorter from '../components/SpeedSorter';
import TermMatch from '../components/TermMatch';
import SpinWheel from '../components/SpinWheel';
import GuessTheIP from '../components/GuessTheIP';
import { useGame } from '../hooks/useGame';

const ModuleDetail = () => {
    const { moduleId } = useParams();
    const module = modulesData.find(m => m.id === moduleId);
    const { completedModules } = useGame();

    const [activeGameIndex, setActiveGameIndex] = useState(null); // null = selection screen

    const isCompleted = module && completedModules.includes(module.id);

    if (!module) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Module Not Found</h2>
                <Link to="/modules" className="text-quest-primary hover:underline">Back to Modules</Link>
            </div>
        );
    }

    const activeGame = activeGameIndex !== null ? module.games[activeGameIndex] : null;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/modules" className="inline-flex items-center text-quest-muted hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
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
                                <BookOpen className="w-4 h-4 mr-3" />
                                <span>{module.games.length} Learning Games</span>
                            </div>
                            <div className="flex items-center text-sm text-quest-muted">
                                <Award className={`w-4 h-4 mr-3 ${isCompleted ? 'text-yellow-500' : ''}`} />
                                <span>{isCompleted ? 'Badge Earned' : 'Complete to Earn Badge'}</span>
                            </div>
                        </div>

                        {activeGameIndex !== null && (
                            <button
                                onClick={() => setActiveGameIndex(null)}
                                className="w-full py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm"
                            >
                                Change Game
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
                        // Game Selection Screen
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Choose a Challenge</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {module.games.map((game, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveGameIndex(index)}
                                        className="glass-panel p-6 rounded-xl text-left hover:border-quest-primary/50 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${game.type === 'quiz' ? 'bg-blue-500/20 text-blue-400' :
                                                    game.type === 'sorter' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        game.type === 'match' ? 'bg-purple-500/20 text-purple-400' :
                                                            game.type === 'spin' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-pink-500/20 text-pink-400'
                                                }`}>
                                                {game.type === 'quiz' && <List className="w-6 h-6" />}
                                                {game.type === 'sorter' && <Calculator className="w-6 h-6" />}
                                                {game.type === 'match' && <List className="w-6 h-6" />}
                                                {game.type === 'spin' && <RotateCw className="w-6 h-6" />}
                                                {game.type === 'guess' && <HelpCircle className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold group-hover:text-quest-primary transition-colors">{game.title}</h3>
                                                <p className="text-sm text-quest-muted">{game.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-quest-muted group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Active Game Screen
                        <div>
                            <div className="mb-4 flex items-center gap-2 text-quest-muted text-sm">
                                <span
                                    onClick={() => setActiveGameIndex(null)}
                                    className="cursor-pointer hover:text-white hover:underline"
                                >
                                    Games
                                </span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-quest-primary">{activeGame.title}</span>
                            </div>

                            {activeGame.type === 'quiz' && (
                                <Quiz questions={activeGame.data.questions} moduleId={module.id} />
                            )}
                            {activeGame.type === 'sorter' && (
                                <SpeedSorter gameData={activeGame.data} moduleId={module.id} />
                            )}
                            {activeGame.type === 'match' && (
                                <TermMatch gameData={activeGame.data} moduleId={module.id} />
                            )}
                            {activeGame.type === 'spin' && (
                                <SpinWheel gameData={activeGame.data} moduleId={module.id} />
                            )}
                            {activeGame.type === 'guess' && (
                                <GuessTheIP gameData={activeGame.data} moduleId={module.id} />
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ModuleDetail;
