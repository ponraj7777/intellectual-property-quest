import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Timer, X, CheckCircle2, AlertCircle, GripVertical } from 'lucide-react';
import {
    DndContext,
    useDraggable,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import { useGame } from '../hooks/useGame';

const DraggableItem = ({ id, content, isMatched }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        disabled: isMatched
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
        relative p-4 mb-3 rounded-xl border-2 cursor-grab active:cursor-grabbing
        ${isMatched
                    ? 'bg-green-500/20 border-green-500/50 opacity-50 cursor-default transition-all'
                    : isDragging
                        ? 'bg-white/5 border-white/20 border-dashed opacity-30 shadow-none'
                        : 'bg-white/5 border-white/10 hover:border-quest-primary/50 hover:bg-white/10 transition-colors'}
      `}
        >
            <div className={`flex items-center gap-3 ${isDragging ? 'invisible' : ''}`}>
                {!isMatched && <GripVertical className="w-4 h-4 text-quest-muted" />}
                <span className="font-medium text-sm md:text-base">{content}</span>
            </div>
            {isMatched && (
                <div className="absolute top-1 right-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
            )}
        </div>
    );
};

const DroppableZone = ({ id, definition, isMatched, feedback }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`
        p-4 mb-3 min-h-[80px] rounded-xl border-2 flex items-center justify-center text-center transition-all
        ${isMatched
                    ? 'bg-green-500/20 border-green-500 border-solid'
                    : isOver
                        ? 'bg-quest-primary/20 border-quest-primary border-dashed scale-[1.02]'
                        : feedback === id
                            ? 'bg-red-500/20 border-red-500 animate-shake'
                            : 'bg-white/5 border-white/10 border-dashed'}
      `}
        >
            <p className="text-sm md:text-base text-quest-muted italic leading-snug">
                {definition}
            </p>
        </div>
    );
};

const TermMatch = ({ gameData, moduleId, levelIndex, difficulty = 'easy', onComplete }) => {
    const [terms, setTerms] = useState([]);
    const [definitions, setDefinitions] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(() => {
        if (difficulty === 'hard') return 30;
        if (difficulty === 'medium') return 60;
        return 90;
    });
    const [gameState, setGameState] = useState('intro');
    const { addXp, completeLevel, completeModule } = useGame();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        if (gameState === 'intro') return;

        // Shuffle terms and definitions independently
        const shuffledTerms = gameData.pairs.map((p, i) => ({ id: `term-${i}`, content: p.term, pairId: i }))
            .sort(() => Math.random() - 0.5);
        const shuffledDefs = gameData.pairs.map((p, i) => ({ id: `def-${i}`, content: p.definition, pairId: i }))
            .sort(() => Math.random() - 0.5);

        setTerms(shuffledTerms);
        setDefinitions(shuffledDefs);
    }, [gameData, gameState]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('failed');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const term = terms.find(t => t.id === active.id);
        const definition = definitions.find(d => d.id === over.id);

        if (term.pairId === definition.pairId) {
            // Correct match
            setMatchedPairs(prev => [...prev, term.pairId]);
            setScore(prev => prev + 25);
            addXp(2); // Small micro-reward

            if (matchedPairs.length + 1 === gameData.pairs.length) {
                setTimeout(() => finishGame(true), 1000);
            }
        } else {
            // Incorrect match
            setFeedback(over.id);
            setTimeout(() => setFeedback(null), 500);
        }
    };

    const finishGame = (success) => {
        setGameState('finished');
        if (success) {
            const finalScore = score + timeLeft;
            addXp(Math.floor(finalScore / 10)); // Bonus XP based on score
            completeLevel(moduleId, levelIndex, difficulty);

            // If it's the last level AND hard difficulty, complete the module
            const module = modulesData.find(m => m.id === moduleId);
            if (levelIndex === module.games.length - 1 && difficulty === 'hard') {
                completeModule(moduleId);
            }
        }
    };

    if (gameState === 'intro') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-quest-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-quest-primary">
                    <GripVertical className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-4 font-heading text-white">IP Matcher</h2>
                <p className="mb-8 text-quest-muted leading-relaxed">
                    Test your expertise! Drag the <span className="text-white font-semibold">IP Terms</span> from the left and drop them onto their correct <span className="text-white font-semibold">Definitions</span> on the right.
                </p>
                <button onClick={() => setGameState('playing')} className="btn-primary w-full md:w-auto px-12 py-4 text-lg">
                    Start Matching
                </button>
            </div>
        );
    }

    if (gameState === 'failed') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Time's Up!</h3>
                <p className="text-quest-muted mb-8">You need to be faster next time.</p>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="btn-primary flex-1">
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (gameState === 'finished') {
        return (
            <div className="glass-panel p-10 rounded-2xl text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-heading text-white">Excellent!</h3>
                <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-quest-muted text-sm mb-1 uppercase tracking-wider">Final Score</p>
                    <p className="text-4xl font-bold text-quest-primary">{score + timeLeft}</p>
                </div>
                <button onClick={() => window.location.reload()} className="btn-primary w-full py-4 text-lg">
                    Next Challenge
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-quest-muted uppercase tracking-wider">Progress</span>
                        <span className="font-bold text-xl">{matchedPairs.length} / {gameData.pairs.length}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-quest-muted uppercase tracking-wider">Score</span>
                        <span className="font-bold text-xl text-quest-primary">{score}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <Timer className={`w-5 h-5 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-quest-muted'}`} />
                    <span className={`font-mono text-2xl font-bold ${timeLeft < 20 ? 'text-red-500' : 'text-white'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Terms */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-quest-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-quest-primary rounded-full"></div>
                            IP Terms
                        </h4>
                        {terms.map((term) => (
                            <DraggableItem
                                key={term.id}
                                id={term.id}
                                content={term.content}
                                isMatched={matchedPairs.includes(term.pairId)}
                            />
                        ))}
                    </div>

                    {/* Right Column: Definitions */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-quest-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-quest-secondary rounded-full"></div>
                            Definitions
                        </h4>
                        {definitions.map((def) => (
                            <DroppableZone
                                key={def.id}
                                id={def.id}
                                definition={def.content}
                                isMatched={matchedPairs.includes(def.pairId)}
                                feedback={feedback}
                            />
                        ))}
                    </div>
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={null} zIndex={1000} style={{ pointerEvents: 'none' }}>
                        {activeId ? (
                            <div className="p-4 rounded-xl border-2 border-quest-primary bg-quest-primary/60 backdrop-blur-lg shadow-2xl scale-110">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-quest-primary" />
                                    <span className="font-bold text-white">
                                        {terms.find(t => t.id === activeId)?.content}
                                    </span>
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <style>{`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
              }
              .animate-shake {
                animation: shake 0.2s ease-in-out infinite;
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.1) !important;
              }
            `}</style>
        </div>
    );
};

export default TermMatch;
