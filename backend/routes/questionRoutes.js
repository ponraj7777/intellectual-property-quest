import express from 'express';
import {
    getQuestions,
    getQuestionsByModule,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from '../controllers/questionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/:moduleId', getQuestionsByModule);
router.post('/', protect, admin, createQuestion);
router.put('/:id', protect, admin, updateQuestion);
router.delete('/:id', protect, admin, deleteQuestion);

export default router;
