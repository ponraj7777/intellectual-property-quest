import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, X } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const TermMatch = ({ gameData, moduleId, onComplete }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState('intro');
    const { addXp, completeModule } = useGame();

    useEffect(() => {
        if (gameState === 'intro') return;

        // Initialize cards
        const initialCards = [];
        gameData.pairs.forEach((pair, index) => {
            initialCards.push({ id: index * 2, content: pair.term, type: 'term', pairId: index });
            initialCards.push({ id: index * 2 + 1, content: pair.definition, type: 'def', pairId: index });
        });
        // Shuffle
        setCards(initialCards.sort(() => Math.random() - 0.5));
    }, [gameData, gameState]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing' && solved.length < gameData.pairs.length) {
            setGameState('failed');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, solved, gameData]);

    const handleCardClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(cards.find(c => c.id === id).pairId)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            if (id !== flipped[0]) {
                setFlipped([...flipped, id]);
                checkMatch(id);
            } else {
                setDisabled(false);
            }
        }
    };

    const checkMatch = (secondId) => {
        const firstId = flipped[0];
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard.pairId === secondCard.pairId) {
            setSolved([...solved, firstCard.pairId]);
            setFlipped([]);
            setDisabled(false);
            setMoves(prev => prev + 1);

            if (solved.length + 1 === gameData.pairs.length) {
                setTimeout(() => finishGame(true), 1000);
            }
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
                setMoves(prev => prev + 1);
            }, 1000);
        }
    };

    const finishGame = (success) => {
        setGameState('finished');
        if (success) {
            const score = Math.max(0, 100 - (moves - gameData.pairs.length) * 5) + timeLeft;
            addXp(score);
            completeModule(moduleId);
        }
    };

    if (gameState === 'intro') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Memory Match</h2>
                <p className="mb-6 text-quest-muted">
                    Flip cards to match the IP terms with their definitions. Be quick!
                </p>
                <button onClick={() => setGameState('playing')} className="btn-primary">
                    Start Matching
                </button>
            </div>
        );
    }

    if (gameState === 'failed') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
                <p className="text-quest-muted mb-6">You ran out of time.</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Try Again
                </button>
            </div>
        )
    }

    if (gameState === 'finished') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">All Matched!</h3>
                <p className="text-xl mb-6">Moves: {moves} | Time Left: {timeLeft}s</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
                <div className="text-quest-muted">Matches: {solved.length} / {gameData.pairs.length}</div>
                <div className={`font-mono text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <motion.button
                        key={card.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCardClick(card.id)}
                        className={`aspect-square rounded-xl p-2 flex items-center justify-center text-center text-sm font-bold transition-all
              ${flipped.includes(card.id) || solved.includes(card.pairId)
                                ? 'bg-quest-primary text-white rotate-y-180'
                                : 'bg-white/10 text-transparent hover:bg-white/20'}
              ${solved.includes(card.pairId) ? 'opacity-50 cursor-default' : ''}
            `}
                    >
                        {(flipped.includes(card.id) || solved.includes(card.pairId)) && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{card.content}</motion.span>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default TermMatch;
