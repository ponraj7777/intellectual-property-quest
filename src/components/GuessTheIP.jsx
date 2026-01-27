import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, HelpCircle, AlertCircle, X, Check } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { modulesData } from '../data/modules';

const GuessTheIP = ({ gameData, moduleId, levelIndex, difficulty = 'easy', onComplete }) => {
    // Game Configuration
    const TOTAL_ROUNDS = 3;

    // State
    const [playlist, setPlaylist] = useState([]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0); // 0-indexed
    const [eliminated, setEliminated] = useState([]);
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(() => {
        if (difficulty === 'hard') return 15;
        if (difficulty === 'medium') return 30;
        return 45;
    });
    const [gameState, setGameState] = useState('intro'); // intro, playing, round_won, failed, finished
    const [totalScore, setTotalScore] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [scorePenalty, setScorePenalty] = useState(0);

    const { addXp, completeLevel, completeModule } = useGame();

    // Initialize Playlist on Mount
    useEffect(() => {
        if (gameData?.scenarios) {
            // Shuffle and pick TOTAL_ROUNDS
            const shuffled = [...gameData.scenarios].sort(() => 0.5 - Math.random());
            setPlaylist(shuffled.slice(0, TOTAL_ROUNDS));
        }
    }, [gameData]);

    const currentScenario = playlist[currentRoundIndex];
    const characters = gameData.characters;
    const clues = currentScenario ? currentScenario.clues : [];
    const correctCharacterId = currentScenario ? currentScenario.correctId : null;

    // Timer Logic
    useEffect(() => {
        let timer;
        const totalDuration = difficulty === 'hard' ? 15 : difficulty === 'medium' ? 30 : 45;
        const clueInterval = totalDuration / 3;

        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);

                // Dynamic clue reveals based on total time
                if (timeLeft <= totalDuration - clueInterval) setCurrentClueIndex(1);
                if (timeLeft <= totalDuration - (clueInterval * 2)) setCurrentClueIndex(2);

            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('failed');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, difficulty]);

    const handleCardClick = (id) => {
        if (gameState !== 'playing' || eliminated.includes(id)) return;

        if (id === correctCharacterId) {
            // Correct Guess
            const calculatedScore = Math.max(0, 100 + (timeLeft * 2) - scorePenalty);
            setRoundScore(calculatedScore);
            setTotalScore(prev => prev + calculatedScore);
            setGameState('round_won');
        } else {
            // Incorrect Guess
            setScorePenalty(prev => prev + 25);
            setEliminated(prev => [...prev, id]);
        }
    };

    const handleNextRound = () => {
        if (currentRoundIndex < TOTAL_ROUNDS - 1) {
            // Next Round
            setCurrentRoundIndex(prev => prev + 1);
            resetRound();
        } else {
            // Game Complete
            setGameState('finished');

            // Scaled XP based on final score and difficulty
            const xpMultiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1.0;
            addXp(Math.floor(totalScore * xpMultiplier / 10)); // Reward fraction of points

            // Level completion logic
            completeLevel(moduleId, levelIndex, difficulty);

            const module = modulesData.find(m => m.id === moduleId);
            if (levelIndex === module.games.length - 1 && difficulty === 'hard') {
                completeModule(moduleId);
            }
        }
    };

    const resetRound = () => {
        setEliminated([]);
        setCurrentClueIndex(0);
        setTimeLeft(difficulty === 'hard' ? 15 : difficulty === 'medium' ? 30 : 45);
        setScorePenalty(0);
        setRoundScore(0);
        setGameState('playing');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    if (gameState === 'intro') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">IP Detective ({difficulty})</h2>
                <p className="mb-6 text-quest-muted">
                    You have {TOTAL_ROUNDS} cases to solve.
                    <br />
                    Each clue reveal happens faster on higher difficulties!
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => setGameState('playing')} className="btn-primary">
                        Start Investigation
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'round_won') {
        const isLastRound = currentRoundIndex === TOTAL_ROUNDS - 1;
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Case Closed!</h3>
                <p className="text-xl mb-2">Correct Answer: <span className="text-quest-primary">{characters.find(c => c.id === correctCharacterId).name}</span></p>
                <p className="text-lg text-quest-muted mb-6">Round Score: +{roundScore}</p>

                <button onClick={handleNextRound} className="btn-primary">
                    {isLastRound ? "View Final Results" : "Next Case"}
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Investigation Complete!</h3>
                <p className="text-[10px] uppercase font-black tracking-widest text-quest-muted mb-2">{difficulty} Mastery</p>
                <p className="text-xl mb-6">Total Game Points: <span className="text-quest-primary font-bold">{totalScore}</span></p>
                <button onClick={handleRetry} className="btn-primary">
                    Play Again
                </button>
            </div>
        );
    }

    // Main Game UI
    return (
        <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto">
            {/* Header / HUD */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="text-sm font-bold text-quest-muted">
                    CASE {currentRoundIndex + 1} / {TOTAL_ROUNDS}
                </div>
                <div className="text-sm font-bold text-quest-muted">
                    POINTS: {totalScore}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Col: Info & Clues */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Clock className={`w-5 h-5 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-quest-primary'}`} />
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
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl z-50 animate-in fade-in duration-300">
                    <div className="text-center p-8 bg-black border border-red-500/50 rounded-xl max-w-md mx-4">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-200 mb-2">Time's Up!</h3>
                        <p className="mb-6 text-gray-300">The correct IP type was: <span className="font-bold text-white">{characters.find(c => c.id === correctCharacterId).name}</span></p>
                        <button onClick={handleRetry} className="btn-primary bg-red-600 hover:bg-red-700">Try Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuessTheIP;
