import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, GripHorizontal } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const MemoryMatch = ({ gameData, moduleId, levelIndex, difficulty }) => {
    const { completeLevel } = useGame();
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!gameData?.pairs) return;

        let initialCards = [];
        gameData.pairs.forEach((pair, index) => {
            initialCards.push({ id: index, type: 'term', content: pair.term });
            initialCards.push({ id: index, type: 'def', content: pair.definition });
        });

        // Shuffle cards
        for (let i = initialCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
        }

        setCards(initialCards);
        setFlippedIndices([]);
        setMatchedIds([]);
        setIsCompleted(false);
    }, [gameData]);

    const handleCardClick = (index) => {
        if (isCompleted || flippedIndices.length === 2 || flippedIndices.includes(index) || matchedIds.includes(cards[index].id)) {
            return;
        }

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            const firstCard = cards[newFlipped[0]];
            const secondCard = cards[newFlipped[1]];

            if (firstCard.id === secondCard.id && firstCard.type !== secondCard.type) {
                // It's a match!
                setMatchedIds(prev => {
                    const newMatched = [...prev, firstCard.id];
                    if (newMatched.length === gameData.pairs.length) {
                        setIsCompleted(true);
                        setTimeout(() => completeLevel(moduleId, levelIndex, difficulty), 1500);
                    }
                    return newMatched;
                });
                setFlippedIndices([]);
            } else {
                // Not a match, flip back after a small delay
                setTimeout(() => {
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center relative w-full">
            <div className="w-full max-w-5xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-heading font-bold text-quest-text mb-2">Memory Match</h2>
                    <p className="text-quest-muted">Find all matching pairs to pass the challenge!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 perspective-1000">
                    {cards.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.id);
                        const isMatched = matchedIds.includes(card.id);

                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`relative w-full h-32 md:h-40 cursor-pointer transition-transform duration-500 transform-style-3d ${
                                    isFlipped ? 'rotate-y-180' : ''
                                }`}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Card Front (Face Down) */}
                                <div className={`absolute w-full h-full backface-hidden rounded-xl border border-white/10 flex items-center justify-center transition-all ${
                                    isFlipped ? 'opacity-0' : 'opacity-100 bg-quest-primary/20 hover:bg-quest-primary/30'
                                }`}>
                                    <GripHorizontal className="w-8 h-8 text-quest-primary/50" />
                                </div>

                                {/* Card Back (Face Up) */}
                                <div 
                                    className={`absolute w-full h-full backface-hidden rounded-xl border flex flex-col items-center justify-center p-4 text-center transition-all rotate-y-180 ${
                                        isMatched 
                                            ? 'bg-green-500/20 border-green-500 text-green-400' 
                                            : 'bg-quest-card/95 border-quest-primary/50 text-quest-text'
                                    }`}
                                >
                                    <span className="text-sm font-medium leading-tight">
                                        {card.content}
                                    </span>
                                    {isMatched && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 glass-panel rounded-2xl border-green-500/30 text-center"
                    >
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Memory Master!</h3>
                        <p className="text-quest-muted">You have successfully matched all the copyright concepts.</p>
                    </motion.div>
                )}
            </div>
            
            {/* Styles for 3D flip card */}
            <style dangerouslySetInnerHTML={{__html: `
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .rotate-y-0 { transform: rotateY(0deg); }
            `}} />
        </div>
    );
};

export default MemoryMatch;
