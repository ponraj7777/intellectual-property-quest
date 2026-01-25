import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Trophy, Timer } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const SpeedSorter = ({ gameData, moduleId, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState('intro'); // intro, playing, finished
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    const { addXp, completeModule } = useGame();
    const currentItem = gameData.items[currentIndex];

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            finishGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleSort = (direction) => { // 'left' or 'right'
        const isCorrect = currentItem.correctCategory === (direction === 'left' ? gameData.categories.left.id : gameData.categories.right.id);

        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback('correct');
            addXp(10); // Instant XP reward
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex < gameData.items.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                finishGame();
            }
        }, 500);
    };

    const finishGame = () => {
        setGameState('finished');
        if (score > 50) { // arbitrary threshold
            completeModule(moduleId);
        }
    };

    if (gameState === 'intro') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Speed Sorter Challenge</h2>
                <p className="mb-6 text-quest-muted">
                    Sort items into <strong className="text-quest-primary">{gameData.categories.left.label}</strong> (Left) or <strong className="text-quest-secondary">{gameData.categories.right.label}</strong> (Right) as fast as you can!
                </p>
                <button onClick={() => setGameState('playing')} className="btn-primary">
                    Start Game
                </button>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
                <p className="text-xl mb-6">Final Score: <span className="text-quest-primary font-bold">{score}</span></p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl max-w-2xl mx-auto overflow-hidden relative">
            {/* HUD */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-quest-muted" />
                    <span className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
                </div>
                <div className="text-xl font-bold text-quest-primary">Score: {score}</div>
            </div>

            {/* Categories */}
            <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 px-4 pointer-events-none opacity-20">
                <div className="text-2xl font-bold -rotate-90 text-quest-primary">{gameData.categories.left.label}</div>
                <div className="text-2xl font-bold rotate-90 text-quest-secondary">{gameData.categories.right.label}</div>
            </div>

            {/* Card */}
            <div className="relative h-64 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, x: feedback === 'correct' ? 0 : (Math.random() > 0.5 ? 100 : -100) }} // Simple exit animation
                        className={`w-64 h-64 bg-quest-card border-2 flex items-center justify-center p-6 rounded-xl shadow-2xl z-10 text-center
                    ${feedback === 'correct' ? 'border-green-500 bg-green-500/10' :
                                feedback === 'wrong' ? 'border-red-500 bg-red-500/10' : 'border-white/10'}
                `}
                    >
                        <span className="text-xl font-bold">{currentItem.text}</span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                    onClick={() => handleSort('left')}
                    className="p-4 rounded-xl bg-quest-primary/20 border border-quest-primary/50 hover:bg-quest-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <ArrowLeft /> {gameData.categories.left.label}
                </button>
                <button
                    onClick={() => handleSort('right')}
                    className="p-4 rounded-xl bg-quest-secondary/20 border border-quest-secondary/50 hover:bg-quest-secondary/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    {gameData.categories.right.label} <ArrowRight />
                </button>
            </div>

            <p className="text-center text-xs text-quest-muted mt-4">Use keyboard arrows or buttons to sort</p>
        </div>
    );
};

export default SpeedSorter;
