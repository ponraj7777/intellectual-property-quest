import Question from '../models/Question.js';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions' });
    }
};

// @desc    Get questions by module
// @route   GET /api/questions/:moduleId
// @access  Public
const getQuestionsByModule = async (req, res) => {
    try {
        const questions = await Question.find({ moduleId: req.params.moduleId });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions for module' });
    }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
    try {
        const { moduleId, gameType, difficulty, levelIndex, title, description, data } = req.body;

        const question = await Question.create({
            moduleId,
            gameType,
            difficulty,
            levelIndex,
            title,
            description,
            data,
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: 'Invalid question data' });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (question) {
            question.moduleId = req.body.moduleId || question.moduleId;
            question.gameType = req.body.gameType || question.gameType;
            question.difficulty = req.body.difficulty || question.difficulty;
            question.levelIndex = req.body.levelIndex !== undefined ? req.body.levelIndex : question.levelIndex;
            question.title = req.body.title || question.title;
            question.description = req.body.description || question.description;
            question.data = req.body.data || question.data;

            const updatedQuestion = await question.save();
            res.json(updatedQuestion);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating question' });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (question) {
            await question.deleteOne();
            res.json({ message: 'Question removed' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question' });
    }
};

export {
    getQuestions,
    getQuestionsByModule,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};
