import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, HelpCircle, AlertCircle, X, Check } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const GuessTheIP = ({ gameData, moduleId, onComplete }) => {
    const [eliminated, setEliminated] = useState([]);
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);
    const [gameState, setGameState] = useState('intro'); // intro, playing, finished
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
    const [scorePenalty, setScorePenalty] = useState(0);

    const { addXp, completeModule } = useGame();

    const characters = gameData.characters;
    const clues = gameData.clues;
    const correctCharacterId = gameData.correctId;

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                if (timeLeft === 31) setCurrentClueIndex(1);
                if (timeLeft === 16) setCurrentClueIndex(2);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('failed');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    // Combined interaction: Clicking a card acts as a guess
    const handleCardClick = (id) => {
        if (gameState !== 'playing' || eliminated.includes(id)) return;

        if (id === correctCharacterId) {
            // Correct Guess
            setGameState('finished');
            setFeedback('correct');
            // Score = Base (100) + TimeBonus (2x seconds left) - Penalty (25 per wrong guess)
            const finalScore = Math.max(0, 100 + (timeLeft * 2) - scorePenalty);
            addXp(finalScore);
            setTimeout(() => completeModule(moduleId), 1500);
        } else {
            // Incorrect Guess
            setScorePenalty(prev => prev + 25);
            setEliminated(prev => [...prev, id]); // Eliminate the card
        }
    };

    if (gameState === 'intro') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">IP Detective</h2>
                <p className="mb-6 text-quest-muted">
                    Read the clues and find the correct IP type.
                    <br />
                    <span className="text-sm opacity-70">Click a card to select it. Careful! Wrong guesses reduce your score.</span>
                </p>
                <button onClick={() => setGameState('playing')} className="btn-primary">
                    Start Investigation
                </button>
            </div>
        );
    }

    if (feedback === 'correct') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Case Solved!</h3>
                <p className="text-xl mb-6">You identified: <span className="text-quest-primary">{characters.find(c => c.id === correctCharacterId).name}</span></p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Col: Info & Clues */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-500' : 'text-quest-primary'}`} />
                            <span className="font-mono text-xl font-bold">{timeLeft}s</span>
                        </div>
                        <div className="text-xs font-bold text-quest-muted">
                            PENALTY: -{scorePenalty}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-quest-muted">Clues</h3>
                        {clues.map((clue, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: index <= currentClueIndex ? 1 : 0.3,
                                    x: 0,
                                    filter: index <= currentClueIndex ? 'blur(0px)' : 'blur(4px)'
                                }}
                                className={`p-4 rounded-xl border-l-4 ${index === currentClueIndex ? 'bg-quest-primary/10 border-quest-primary' :
                                        index < currentClueIndex ? 'bg-white/5 border-white/20' : 'bg-black/20 border-white/5'
                                    }`}
                            >
                                {index > currentClueIndex ? "Wait for clue..." : clue}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Cards Grid */}
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {characters.map(char => {
                            const isEliminated = eliminated.includes(char.id);
                            return (
                                <motion.button
                                    key={char.id}
                                    layout
                                    onClick={() => handleCardClick(char.id)}
                                    disabled={isEliminated}
                                    className={`aspect-[3/4] rounded-xl relative overflow-hidden transition-all duration-300 group
                                ${isEliminated ? 'bg-black/40 scale-95 opacity-50 cursor-not-allowed' : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-quest-primary/50 hover:scale-[1.02]'}
                            `}
                                >
                                    {/* Content */}
                                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 ${isEliminated ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                                        <div className="text-4xl mb-4">{char.icon}</div>
                                        <div className="font-bold text-center leading-tight">{char.name}</div>
                                    </div>

                                    {/* Eliminated Overlay */}
                                    {isEliminated && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <X className="w-16 h-16 text-red-500/80" />
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Game Over Screen if Time Runs Out */}
            {gameState === 'failed' && (
                <div className="mt-8 text-center p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <h3 className="font-bold text-red-200 mb-2">Time's Up!</h3>
                    <p className="mb-4 text-sm">The correct IP type was: <span className="font-bold text-white">{characters.find(c => c.id === correctCharacterId).name}</span></p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">Try Again</button>
                </div>
            )}
        </div>
    );
};


export default GuessTheIP;
