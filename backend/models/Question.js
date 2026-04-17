import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
    {
        moduleId: {
            type: String,
            required: true,
        },
        levelIndex: {
            type: Number,
            default: -1, // -1 means append to end
        },
        gameType: {
            type: String,
            required: true,
            enum: ['quiz', 'sorter', 'reverse-hangman', 'match', 'archery', 'snake', 'spin', 'guess'],
        },
        difficulty: {
            type: String,
            required: true,
            enum: ['easy', 'medium', 'hard'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;
