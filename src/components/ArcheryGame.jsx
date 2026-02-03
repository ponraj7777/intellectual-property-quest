import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, ArrowRight, RotateCcw, MousePointer2 } from 'lucide-react';
import { useGame } from '../hooks/useGame';

const ArcheryGame = ({ gameData, moduleId, levelIndex, difficulty }) => {
    const { questions } = gameData;
    const { updateProgress } = useGame();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, shooting, result, finished
    const [angle, setAngle] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [tension, setTension] = useState(0);
    const [arrows, setArrows] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const containerRef = useRef(null);
    const currentQuestion = questions[currentQuestionIndex];

    // Center of the bow pivot
    const bowPivot = { x: 80, y: 300 }; // Adjusted for layout

    const handleInteraction = (clientX, clientY) => {
        if (!containerRef.current || gameState !== 'playing') return;

        const rect = containerRef.current.getBoundingClientRect();
        // Calculate relative coordinates from container's Game Area start
        // The game play area starts after the header (approx 160px)
        const playAreaTop = rect.top + 160;

        const mouseX = clientX - rect.left;
        const mouseY = clientY - playAreaTop;

        const deltaX = mouseX - bowPivot.x;
        const deltaY = mouseY - (rect.height - 160) / 2; // Midpoint of play area

        // Angry Birds style: pulling AWAY from the target area (right side)
        // If we pull left, we aim right.
        let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        // We want the arrow to point TOWARDS the targets (right)
        // So we limit the angle to a reasonable forward arc
        newAngle = Math.max(-60, Math.min(60, newAngle));
        setAngle(newAngle);

        // Visual tension
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        setTension(Math.min(40, distance / 3));

        // Highlight option based on angle
        const optionCount = currentQuestion.options.length;
        const normalizedAngle = (newAngle + 60) / 120;
        const index = Math.floor(normalizedAngle * optionCount);
        const clampedIndex = Math.max(0, Math.min(optionCount - 1, index));
        setSelectedOption(clampedIndex);
    };

    const onMouseDown = (e) => {
        if (gameState !== 'playing') return;
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY);
    };

    const onMouseMove = (e) => {
        if (isDragging) {
            handleInteraction(e.clientX, e.clientY);
        }
    };

    const onMouseUp = () => {
        if (isDragging) {
            handleShoot();
            setIsDragging(false);
            setTension(0);
        }
    };

    const handleShoot = () => {
        if (gameState !== 'playing' || selectedOption === null) return;

        setGameState('shooting');

        // Projectile Motion Constants
        const v0 = 1200; // pixels per second
        const g = 1000; // gravity pixels per second^2
        const rad = (angle * Math.PI) / 180;
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);

        // Calculate flight duration based on fixed horizontal distance
        // We want to hit the targets which are on the right side
        const rect = containerRef.current.getBoundingClientRect();
        const targetX = rect.width - 450; // Distance to the target containers
        const T = targetX / vx;

        const steps = 15;
        const xKeyframes = [];
        const yKeyframes = [];
        const rotateKeyframes = [];

        for (let i = 0; i <= steps; i++) {
            const t = (T * i) / steps;
            xKeyframes.push(vx * t);
            const currentVy = vy + g * t;
            yKeyframes.push(vy * t + 0.5 * g * t * t);
            rotateKeyframes.push(Math.atan2(currentVy, vx) * (180 / Math.PI));
        }

        const newArrow = {
            id: Date.now(),
            x: xKeyframes,
            y: yKeyframes,
            rotate: rotateKeyframes,
            duration: T
        };
        setArrows([newArrow]);

        // Delay for arrow animation
        setTimeout(() => {
            const isCorrect = selectedOption === currentQuestion.correctAnswer;
            if (isCorrect) {
                setScore(s => s + 100);
                setFeedback({ type: 'correct', text: 'Bullseye! +100' });
            } else {
                setFeedback({ type: 'incorrect', text: 'Missed! The correct answer was: ' + currentQuestion.options[currentQuestion.correctAnswer] });
            }
            setGameState('result');
        }, T * 1000);
    };

    const nextQuestion = () => {
        setArrows([]);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setGameState('playing');
            setFeedback(null);
            setSelectedOption(null);
            setAngle(0);
        } else {
            setGameState('finished');
            updateProgress(moduleId, levelIndex, difficulty, score);
        }
    };

    const resetGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState('playing');
        setArrows([]);
        setFeedback(null);
        setSelectedOption(null);
        setAngle(0);
    };

    if (gameState === 'finished') {
        return (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Challenge Complete!
                </h2>
                <div className="text-6xl font-black text-white">{score}</div>
                <p className="text-quest-muted">You've mastered these copyright principles!</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                            <RotateCcw className="w-5 h-5" />
                        </motion.div>
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* How to Play Section (Player Friendly) */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-quest-primary mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4" /> How to Play
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <div className="text-[10px] text-white/40 font-bold uppercase">Step 1</div>
                        <p className="text-sm text-white/80 font-medium">The arrow is already placed on the bow</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] text-white/40 font-bold uppercase">Step 2</div>
                        <p className="text-sm text-white/80 font-medium">Drag the arrow to set the shooting direction</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] text-white/40 font-bold uppercase">Step 3</div>
                        <p className="text-sm text-white/80 font-medium">Release to fire (Fixed power)</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] text-white/40 font-bold uppercase">Step 4</div>
                        <p className="text-sm text-white/80 font-medium">Aim carefully to hit the target and score points</p>
                    </div>
                </div>
            </div>

            <div
                ref={containerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                className="relative h-[650px] w-full glass-panel rounded-2xl overflow-hidden select-none flex flex-col cursor-crosshair touch-none"
            >
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(66,133,244,0.1),transparent_70%)]" />
                </div>

                {/* Minimal UI Text Overlay */}
                <div className="absolute bottom-6 left-6 z-10">
                    <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-quest-muted">
                        Drag to aim • Release to shoot • Fixed power
                    </div>
                </div>

                {/* Question Area */}
                <div className="p-8 pb-12 text-center border-b border-white/5 bg-white/2 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2 max-w-2xl mx-auto leading-tight">{currentQuestion.text}</h3>
                    <div className="flex items-center justify-center gap-4">
                        <span className="text-xs text-quest-muted uppercase tracking-widest font-bold">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-quest-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Game Play Area */}
                <div className="relative flex-1">
                    {/* Scoreboard */}
                    <div className="absolute top-4 right-6 px-6 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md z-10 flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-quest-muted text-xs font-bold uppercase tracking-widest">Score</span>
                        <span className="text-xl font-black text-white">{score}</span>
                    </div>

                    {/* Archer Area (Interactive Hint) */}
                    <div className="absolute left-20 top-1/2 -translate-y-1/2 z-30">
                        <motion.div
                            animate={{ rotate: angle }}
                            style={{ transformOrigin: 'center left' }}
                            className="relative w-40 h-40 flex items-center"
                        >
                            <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible">
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                {/* Bow String (Dynamic based on drag tension) */}
                                <motion.path
                                    d={`M 40 10 Q ${40 - (isDragging ? tension : 0)} 70 40 130`}
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.4)"
                                    strokeWidth="2"
                                    animate={{ d: `M 40 10 Q ${40 - (isDragging ? tension : 0)} 70 40 130` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                                {/* Bow Arc */}
                                <path
                                    d="M 40 10 C 90 10 90 130 40 130"
                                    fill="none"
                                    stroke="#8B4513"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                                {/* Arrow preloaded */}
                                {(gameState === 'playing') && (
                                    <motion.g animate={{ x: isDragging ? -tension : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                        <line x1="0" y1="70" x2="70" y2="70" stroke="#f97316" strokeWidth="5" strokeLinecap="round" filter="url(#glow)" />
                                        <path d="M 70 70 L 55 62 M 70 70 L 55 78" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                                    </motion.g>
                                )}
                            </svg>


                        </motion.div>

                        {/* Drag Gesture Hint */}
                        {!isDragging && gameState === 'playing' && currentQuestionIndex === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -bottom-12 left-0 flex items-center gap-2 text-quest-primary font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                            >
                                <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <MousePointer2 className="w-4 h-4" />
                                </motion.div>
                                Drag the arrow to start
                            </motion.div>
                        )}
                    </div>

                    {/* Options Area (Targets) */}
                    <div className="absolute right-12 inset-y-0 flex flex-col justify-center gap-6 items-end z-20">
                        {currentQuestion.options.map((option, idx) => (
                            <motion.div
                                key={idx}
                                animate={{
                                    scale: selectedOption === idx ? 1.05 : 1,
                                    x: selectedOption === idx ? -10 : 0,
                                    borderColor: selectedOption === idx ? 'rgba(66, 133, 244, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                                    backgroundColor: selectedOption === idx ? 'rgba(66, 133, 244, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    boxShadow: selectedOption === idx ? '0 10px 30px -10px rgba(66, 133, 244, 0.2)' : 'none'
                                }}
                                className={`px-8 py-5 rounded-2xl border-2 transition-all min-w-[320px] text-right relative glass-panel`}
                            >
                                
                                <span className={`text-lg font-bold block ${selectedOption === idx ? 'text-white' : 'text-quest-muted'}`}>
                                    {option}
                                </span>
                                {selectedOption === idx && (
                                    <motion.div
                                        layoutId="active-option"
                                        // className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-quest-primary rounded-full"
                                    />
                                )}
                                <Target className={`w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 transition-all ${selectedOption === idx ? 'text-quest-primary scale-125' : 'text-white/10'}`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Flying Arrows (Projectile Motion) */}
                    {arrows.map(arrow => (
                        <motion.div
                            key={arrow.id}
                            initial={{
                                left: '120px',
                                top: '50%',
                                rotate: arrow.rotate[0],
                                opacity: 1,
                                x: 0,
                                y: 0
                            }}
                            animate={{
                                x: arrow.x,
                                y: arrow.y,
                                rotate: arrow.rotate,
                                opacity: [1, 1, 0]
                            }}
                            transition={{ duration: arrow.duration, ease: "linear" }}
                            className="absolute z-40"
                        >
                            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-y-[8px] border-y-transparent border-l-[16px] border-l-orange-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 30 }}
                                animate={{ scale: 1, y: 0 }}
                                className="text-center max-w-xl glass-panel p-12 rounded-3xl border-white/20 shadow-2xl"
                            >
                                <div className={`text-6xl font-black mb-6 tracking-tighter ${feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                    {feedback.type === 'correct' ? 'BULLSEYE!' : 'MISS!'}
                                </div>
                                <p className="text-white text-2xl mb-12 leading-relaxed font-medium">
                                    {feedback.text}
                                </p>
                                <button
                                    onClick={nextQuestion}
                                    className="px-14 py-5 bg-quest-primary text-white rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto group shadow-2xl shadow-quest-primary/30"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? 'Continue Quest' : 'Reveal Score'}
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ArcheryGame;
