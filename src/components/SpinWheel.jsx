import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Trophy, ArrowDown } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { modulesData } from '../data/modules';

const SpinWheel = ({ gameData, moduleId, levelIndex, difficulty = 'easy', onComplete }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const controls = useAnimation();
    const { addXp, completeLevel, completeModule } = useGame();

    const segments = gameData.segments;
    const numSegments = segments.length;
    const segmentAngle = 360 / numSegments;
    const radius = 120; // SVG radius
    const center = 128; // SVG center

    // Helper to convert polar to cartesian
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y
        ].join(" ");
    }

    const spin = async () => {
        if (isSpinning || result) return;
        setIsSpinning(true);

        const randomSegmentIndex = Math.floor(Math.random() * numSegments);
        const extraRotation = 360 * 5;

        // We want the chosen segment to land at the TOP (0 degrees).
        // Our segments start at 0 deg (12 o'clock) and go clockwise.
        // Segment i spans from i*angle to (i+1)*angle.
        // The center of segment i is at (i + 0.5) * angle.
        // To land center of segment i at 0 deg, we need to rotate: - (i + 0.5) * angle.

        const segmentCenterAngle = (randomSegmentIndex + 0.5) * segmentAngle;
        const targetRotation = extraRotation + (360 - segmentCenterAngle);

        await controls.start({
            rotate: targetRotation,
            transition: { duration: 4, ease: "circOut" }
        });

        setResult(segments[randomSegmentIndex]);
        setIsSpinning(false);
        setTimeout(() => setShowQuestion(true), 1000);
    };

    const handleAnswer = (optionIndex) => {
        if (answered) return;
        setAnswered(true);

        if (optionIndex === result.question.correctAnswer) {
            setFeedback('correct');
            addXp(difficulty === 'hard' ? 150 : difficulty === 'medium' ? 100 : 50);

            // Level completion logic
            completeLevel(moduleId, levelIndex, difficulty);

            const module = modulesData.find(m => m.id === moduleId);
            if (levelIndex === module.games.length - 1 && difficulty === 'hard') {
                completeModule(moduleId);
            }
        } else {
            setFeedback('wrong');
        }
    };

    if (feedback === 'correct') {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Correct!</h3>
                <p className="text-xl mb-6">You mastered the topic: <span className="text-quest-primary">{result.label}</span></p>
                <div className="flex justify-center gap-4 mb-8 text-xs font-bold font-mono opacity-50 uppercase tracking-tighter">
                    <span>Difficulty Cleared: {difficulty}</span>
                </div>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8">Spin & Win: Subtopic Roulette</h2>

            {!showQuestion ? (
                <div className="relative mb-8 w-64 h-64">
                    {/* Arrow Indicator */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-white drop-shadow-lg">
                        <ArrowDown className="w-10 h-10 fill-quest-primary stroke-white" />
                    </div>

                    {/* Wheel SVG */}
                    <motion.div
                        className="w-64 h-64"
                        animate={controls}
                        style={{ rotate: 0 }}
                    >
                        <svg width="256" height="256" viewBox="0 0 256 256">
                            <defs>
                                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
                                </filter>
                            </defs>
                            <circle cx="128" cy="128" r="126" fill="#0f172a" stroke="#fff" strokeWidth="2" />

                            {segments.map((segment, index) => {
                                const startAngle = index * segmentAngle;
                                const endAngle = (index + 1) * segmentAngle;
                                const midAngle = startAngle + (segmentAngle / 2);

                                // Position text
                                const textRadius = radius * 0.65;
                                const textPos = polarToCartesian(center, center, textRadius, midAngle);

                                return (
                                    <g key={index}>
                                        <path
                                            d={describeArc(center, center, radius, startAngle, endAngle)}
                                            fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'}
                                            stroke="white"
                                            strokeWidth="1"
                                        />

                                        <text
                                            x={textPos.x}
                                            y={textPos.y}
                                            fill="white"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize="12"
                                            fontWeight="bold"
                                            style={{
                                                transformBox: 'fill-box',
                                                transformOrigin: 'center',
                                                transform: `rotate(${midAngle + 90}deg)` // Rotate text to readable angle
                                            }}
                                        >
                                            {segment.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </motion.div>

                    {/* Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-quest-dark z-10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-quest-dark rounded-full" />
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={spin}
                            className="btn-primary"
                            disabled={isSpinning}
                        >
                            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    <div className="text-center mb-6">
                        <span className="text-sm text-quest-muted uppercase tracking-wider">Topic Selected ({difficulty})</span>
                        <h3 className="text-2xl font-bold text-quest-primary">{result.label}</h3>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                        <p className="text-lg font-bold mb-6">{result.question.text}</p>
                        <div className="space-y-3">
                            {result.question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={answered}
                                    className={`w-full p-4 rounded-lg text-left transition-all border ${answered
                                        ? idx === result.question.correctAnswer
                                            ? 'bg-green-500/20 border-green-500'
                                            : idx === feedback && idx !== result.question.correctAnswer
                                                ? 'bg-red-500/20 border-red-500'
                                                : 'bg-white/5 border-transparent opacity-50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {feedback === 'wrong' && (
                            <div className="mt-6 text-center">
                                <p className="text-red-400 mb-4">Incorrect. Give it another shot!</p>
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setShowQuestion(false);
                                        setAnswered(false);
                                        setFeedback(null);
                                    }}
                                    className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SpinWheel;
