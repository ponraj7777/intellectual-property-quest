import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { modulesData } from '../data/modules';

const Quiz = ({ questions, moduleId, levelIndex, difficulty = 'easy', onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const { addXp, completeLevel, completeModule } = useGame();

    const handleAnswer = (optionIndex) => {
        if (isAnswered) return;

        setSelectedAnswer(optionIndex);
        setIsAnswered(true);

        if (optionIndex === questions[currentIndex].correctAnswer) {
            setScore(score + 1);
            addXp(difficulty === 'hard' ? 100 : difficulty === 'medium' ? 75 : 50);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            if (score >= questions.length * 0.7) { // 70% passing grade
                completeLevel(moduleId, levelIndex, difficulty);

                // If it's the last level AND hard difficulty, complete the module
                const module = modulesData.find(m => m.id === moduleId);
                if (levelIndex === module.games.length - 1 && difficulty === 'hard') {
                    completeModule(moduleId);
                }
            }
            if (onComplete) onComplete(score);
        }
    };

    if (showResult) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl text-center"
            >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                <p className="text-xl mb-6">You scored <span className="text-quest-primary font-bold">{score} / {questions.length}</span></p>

                <div className="text-quest-muted mb-8">
                    {score >= questions.length * 0.7 ? (
                        <p>Congratulations! You've mastered this module and earned a badge.</p>
                    ) : (
                        <p>Nice try! Review the material and try again to earn your badge.</p>
                    )}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Try Again
                </button>
            </motion.div>
        );
    }

    const question = questions[currentIndex];

    return (
        <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-6 text-sm text-quest-muted">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <h3 className="text-xl font-bold mb-8">{question.text}</h3>

            <div className="space-y-4 mb-8">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={isAnswered}
                        className={`w-full p-4 rounded-xl text-left transition-all border ${isAnswered
                            ? index === question.correctAnswer
                                ? 'bg-green-500/20 border-green-500 text-green-200'
                                : index === selectedAnswer
                                    ? 'bg-red-500/20 border-red-500 text-red-200'
                                    : 'bg-white/5 border-transparent opacity-50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-quest-primary/50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isAnswered && index === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {isAnswered && index === selectedAnswer && index !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                    </button>
                ))}
            </div>

            {isAnswered && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                >
                    <button onClick={nextQuestion} className="btn-primary">
                        {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Quiz;
