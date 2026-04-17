import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Layout, Layers, Shield, HelpCircle, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useGame } from '../hooks/useGame';
import { modulesData } from '../data/modules';

const getDefaultDataForGameType = (type, targetGame = null) => {
    if (['quiz', 'reverse-hangman', 'archery', 'snake'].includes(type)) {
        return { questions: [{ text: '', options: ['', '', '', ''], correctAnswer: 0 }] };
    }
    if (type === 'sorter') {
        const categories = targetGame?.data?.categories || { left: { id: 'left', label: 'Category A' }, right: { id: 'right', label: 'Category B' } };
        return {
            categories: categories,
            items: [{ text: '', correctCategory: categories.left.id }]
        };
    }
    if (type === 'match' || type === 'memory') {
        return { pairs: [{ term: '', definition: '' }] };
    }
    if (type === 'spin') {
        return { segments: [{ label: '', question: { text: '', options: ['', '', '', ''], correctAnswer: 0 } }] };
    }
    if (type === 'guess') {
        return {
            scenarios: [{ correctId: '', clues: ['', '', ''] }],
            characters: [{ id: '', name: '', icon: '' }]
        };
    }
    return {};
};

const QuestionManager = () => {
    const { user: authUser } = useGame();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        moduleId: 'patents',
        gameType: 'quiz',
        difficulty: 'easy',
        levelIndex: 0,
        title: '',
        description: '',
        data: getDefaultDataForGameType('quiz')
    });

    const [isExpertMode, setIsExpertMode] = useState(false);

    const modules = ['patents', 'copyrights', 'trademarks', 'trade-secrets'];

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/questions');
            const dbQuestions = await response.json();
            
            const staticQuestions = [];
            modulesData.forEach(module => {
                module.games.forEach((game, levelIndex) => {
                    const hasOverride = dbQuestions.some(q => q.moduleId === module.id && q.levelIndex === levelIndex);
                    if (!hasOverride) {
                        staticQuestions.push({
                            _id: `static-${module.id}-${levelIndex}`,
                            isStatic: true,
                            moduleId: module.id,
                            gameType: game.type,
                            difficulty: levelIndex <= 2 ? 'easy' : levelIndex <= 5 ? 'medium' : 'hard',
                            levelIndex: levelIndex,
                            title: game.title,
                            description: game.description,
                            data: game.data
                        });
                    }
                });
            });

            setQuestions([...staticQuestions, ...dbQuestions]);
        } catch (error) {
            toast.error('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        const firstGame = modulesData.find(m => m.id === 'patents')?.games[0];
        setFormData({
            moduleId: 'patents',
            gameType: firstGame ? firstGame.type : 'quiz',
            difficulty: 'easy',
            levelIndex: 0,
            title: '',
            description: '',
            data: getDefaultDataForGameType(firstGame ? firstGame.type : 'quiz', firstGame)
        });
        setIsAdding(true);
        setEditingId(null);
        setIsExpertMode(false);
    };

    const handleEdit = (q) => {
        setFormData({
            moduleId: q.moduleId,
            gameType: q.gameType,
            difficulty: q.difficulty,
            levelIndex: q.levelIndex ?? -1,
            title: q.title,
            description: q.description || '',
            data: q.data
        });
        setEditingId(q._id);
        setIsAdding(true);
        setIsExpertMode(!(
            (['quiz', 'reverse-hangman', 'archery', 'snake'].includes(q.gameType) && q.data?.questions) ||
            (q.gameType === 'sorter' && q.data?.categories && q.data?.items) ||
            ((q.gameType === 'match' || q.gameType === 'memory') && q.data?.pairs) ||
            (q.gameType === 'spin' && q.data?.segments) ||
            (q.gameType === 'guess' && q.data?.scenarios && q.data?.characters)
        ));
    };

    const handleDelete = async (id) => {
        if (typeof id === 'string' && id.startsWith('static-')) {
            toast.error("Factory defaults cannot be deleted entirely. Click 'Edit' instead to remove its internal questions.");
            return;
        }

        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authUser?.token}`,
                },
            });

            if (response.ok) {
                toast.success('Question deleted');
                fetchQuestions();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting question');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const isEditingStatic = typeof editingId === 'string' && editingId.startsWith('static-');
            
            const url = (editingId && !isEditingStatic)
                ? `http://localhost:5000/api/questions/${editingId}`
                : 'http://localhost:5000/api/questions';

            const method = (editingId && !isEditingStatic) ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authUser?.token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingId ? 'Question updated' : 'Question added');
                setIsAdding(false);
                fetchQuestions();
            } else {
                const err = await response.json();
                toast.error(err.message || 'Failed to save');
            }
        } catch (error) {
            toast.error('Error saving question');
        }
    };

    const handleDataChange = (val) => {
        try {
            const parsed = typeof val === 'string' ? JSON.parse(val) : val;
            setFormData({ ...formData, data: parsed });
        } catch (e) {
            setFormData({ ...formData, data: val });
        }
    };

    const renderQuizLikeForm = () => {
        return (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.data.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-quest-primary">Question {qIdx + 1}</h4>
                            {formData.data.questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newQs = [...formData.data.questions];
                                        newQs.splice(qIdx, 1);
                                        setFormData({ ...formData, data: { ...formData.data, questions: newQs } });
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Question Text"
                            className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                            value={q.text}
                            onChange={(e) => {
                                const newQs = [...formData.data.questions];
                                newQs[qIdx].text = e.target.value;
                                setFormData({ ...formData, data: { ...formData.data, questions: newQs } });
                            }}
                            required
                        />
                        <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="relative">
                                    <input
                                        type="text"
                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                        className={`w-full dark:bg-white/5 bg-black/5 border ${q.correctAnswer === optIdx ? 'border-quest-primary/50' : 'dark:border-white/10 border-black/10'} rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newQs = [...formData.data.questions];
                                            newQs[qIdx].options[optIdx] = e.target.value;
                                            setFormData({ ...formData, data: { ...formData.data, questions: newQs } });
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newQs = [...formData.data.questions];
                                            newQs[qIdx].correctAnswer = optIdx;
                                            setFormData({ ...formData, data: { ...formData.data, questions: newQs } });
                                        }}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black
                                            ${q.correctAnswer === optIdx ? 'bg-quest-primary text-quest-text' : 'dark:bg-white/10 bg-black/10 text-quest-muted hover:bg-black/20 dark:hover:bg-white/20'}
                                        `}
                                    >
                                        {q.correctAnswer === optIdx ? '✓' : ''}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        const newQs = [...(formData.data.questions || [])];
                        newQs.push({ text: '', options: ['', '', '', ''], correctAnswer: 0 });
                        setFormData({ ...formData, data: { ...formData.data, questions: newQs } });
                    }}
                    className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text hover:border-quest-primary/50 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Another Question
                </button>
            </div>
        );
    };

    const renderSorterForm = () => {
        return (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl space-y-2 flex flex-col justify-center items-center cursor-not-allowed opacity-80 title='Categories are strictly enforced by the current module level'">
                        <span className="text-xs uppercase tracking-wider font-bold text-quest-primary block">Left Category</span>
                        <div className="px-4 py-3 text-quest-text font-bold bg-black/10 dark:bg-white/10 rounded-xl text-center w-full shadow-inner border border-black/5 dark:border-white/5 truncate">
                            {formData.data.categories?.left?.label || 'Category A'}
                        </div>
                    </div>
                    <div className="p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl space-y-2 flex flex-col justify-center items-center cursor-not-allowed opacity-80 title='Categories are strictly enforced by the current module level'">
                        <span className="text-xs uppercase tracking-wider font-bold text-quest-primary block">Right Category</span>
                        <div className="px-4 py-3 text-quest-text font-bold bg-black/10 dark:bg-white/10 rounded-xl text-center w-full shadow-inner border border-black/5 dark:border-white/5 truncate">
                            {formData.data.categories?.right?.label || 'Category B'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-quest-text">Items</h4>
                    {formData.data.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Item text"
                                className="flex-1 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={item.text}
                                onChange={(e) => {
                                    const newItems = [...formData.data.items];
                                    newItems[idx].text = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, items: newItems } });
                                }}
                            />
                            <select
                                className="bg-quest-card border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={item.correctCategory || formData.data.categories?.left?.id || 'left'}
                                onChange={(e) => {
                                    const newItems = [...formData.data.items];
                                    newItems[idx].correctCategory = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, items: newItems } });
                                }}
                            >
                                <option value={formData.data.categories?.left?.id || 'left'}>{formData.data.categories?.left?.label || 'Left'}</option>
                                <option value={formData.data.categories?.right?.id || 'right'}>{formData.data.categories?.right?.label || 'Right'}</option>
                            </select>
                            {formData.data.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newItems = [...formData.data.items];
                                        newItems.splice(idx, 1);
                                        setFormData({ ...formData, data: { ...formData.data, items: newItems } });
                                    }}
                                    className="p-2 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => {
                        const newItems = [...(formData.data.items || [])];
                        newItems.push({ text: '', correctCategory: formData.data.categories?.left?.id || 'left' });
                        setFormData({ ...formData, data: { ...formData.data, items: newItems } });
                    }}
                    className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text hover:border-quest-primary/50 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Item
                </button>
            </div>
        );
    };

    const renderMatchForm = () => {
        return (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.data.pairs?.map((pair, idx) => (
                    <div key={idx} className="flex gap-2 items-center p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl">
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                placeholder="Term"
                                className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={pair.term}
                                onChange={(e) => {
                                    const newPairs = [...formData.data.pairs];
                                    newPairs[idx].term = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, pairs: newPairs } });
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Definition"
                                className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={pair.definition}
                                onChange={(e) => {
                                    const newPairs = [...formData.data.pairs];
                                    newPairs[idx].definition = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, pairs: newPairs } });
                                }}
                            />
                        </div>
                        {formData.data.pairs.length > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    const newPairs = [...formData.data.pairs];
                                    newPairs.splice(idx, 1);
                                    setFormData({ ...formData, data: { ...formData.data, pairs: newPairs } });
                                }}
                                className="p-2 text-red-400 hover:text-red-300 ml-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        const newPairs = [...(formData.data.pairs || [])];
                        newPairs.push({ term: '', definition: '' });
                        setFormData({ ...formData, data: { ...formData.data, pairs: newPairs } });
                    }}
                    className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text hover:border-quest-primary/50 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Pair
                </button>
            </div>
        );
    };

    const renderSpinForm = () => {
        return (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.data.segments?.map((seg, idx) => (
                    <div key={idx} className="p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-quest-primary">Segment {idx + 1}</h4>
                            {formData.data.segments.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newSegs = [...formData.data.segments];
                                        newSegs.splice(idx, 1);
                                        setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Segment Label"
                            className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                            value={seg.label}
                            onChange={(e) => {
                                const newSegs = [...formData.data.segments];
                                newSegs[idx].label = e.target.value;
                                setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                            }}
                            required
                        />
                        <div className="pt-2 border-t dark:border-white/10 border-black/10 space-y-2">
                            <label className="text-xs font-medium text-quest-muted">Question for this segment</label>
                            <input
                                type="text"
                                placeholder="Question Text"
                                className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={seg.question.text}
                                onChange={(e) => {
                                    const newSegs = [...formData.data.segments];
                                    newSegs[idx].question.text = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                                }}
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                {seg.question.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="relative">
                                        <input
                                            type="text"
                                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                            className={`w-full dark:bg-white/5 bg-black/5 border ${seg.question.correctAnswer === optIdx ? 'border-quest-primary/50' : 'dark:border-white/10 border-black/10'} rounded-lg px-4 py-2 text-quest-text text-sm focus:outline-none`}
                                            value={opt}
                                            onChange={(e) => {
                                                const newSegs = [...formData.data.segments];
                                                newSegs[idx].question.options[optIdx] = e.target.value;
                                                setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                                            }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newSegs = [...formData.data.segments];
                                                newSegs[idx].question.correctAnswer = optIdx;
                                                setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                                            }}
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black
                                                ${seg.question.correctAnswer === optIdx ? 'bg-quest-primary text-quest-text' : 'dark:bg-white/10 bg-black/10 text-quest-muted hover:bg-black/20 dark:hover:bg-white/20'}
                                            `}
                                        >
                                            {seg.question.correctAnswer === optIdx ? '✓' : ''}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => {
                        const newSegs = [...(formData.data.segments || [])];
                        newSegs.push({ label: '', question: { text: '', options: ['', '', '', ''], correctAnswer: 0 } });
                        setFormData({ ...formData, data: { ...formData.data, segments: newSegs } });
                    }}
                    className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text hover:border-quest-primary/50 transition-all text-sm flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Segment
                </button>
            </div>
        );
    };

    const renderGuessForm = () => {
        return (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                    <h3 className="text-quest-text font-bold">Characters</h3>
                    {formData.data.characters?.map((char, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="ID (e.g. patent)"
                                className="flex-1 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-3 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={char.id}
                                onChange={(e) => {
                                    const newChars = [...formData.data.characters];
                                    newChars[idx].id = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, characters: newChars } });
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Name (e.g. Patent)"
                                className="flex-1 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-3 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                value={char.name}
                                onChange={(e) => {
                                    const newChars = [...formData.data.characters];
                                    newChars[idx].name = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, characters: newChars } });
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Icon (e.g. ⚙️)"
                                className="w-16 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-3 py-2 text-quest-text text-sm text-center focus:outline-none focus:border-quest-primary/50"
                                value={char.icon}
                                onChange={(e) => {
                                    const newChars = [...formData.data.characters];
                                    newChars[idx].icon = e.target.value;
                                    setFormData({ ...formData, data: { ...formData.data, characters: newChars } });
                                }}
                            />
                            {formData.data.characters.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newChars = [...formData.data.characters];
                                        newChars.splice(idx, 1);
                                        setFormData({ ...formData, data: { ...formData.data, characters: newChars } });
                                    }}
                                    className="p-2 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            const newChars = [...(formData.data.characters || [])];
                            newChars.push({ id: '', name: '', icon: '' });
                            setFormData({ ...formData, data: { ...formData.data, characters: newChars } });
                        }}
                        className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Character
                    </button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-quest-text font-bold">Scenarios (Clues)</h3>
                    {formData.data.scenarios?.map((scenario, idx) => (
                        <div key={idx} className="p-4 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <select
                                    className="bg-[#1a1a1a] border dark:border-white/10 border-black/10 rounded-lg px-3 py-1.5 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                    value={scenario.correctId}
                                    onChange={(e) => {
                                        const newScen = [...formData.data.scenarios];
                                        newScen[idx].correctId = e.target.value;
                                        setFormData({ ...formData, data: { ...formData.data, scenarios: newScen } });
                                    }}
                                >
                                    <option value="" disabled>Select Correct Character</option>
                                    {formData.data.characters?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {formData.data.scenarios.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newScen = [...formData.data.scenarios];
                                            newScen.splice(idx, 1);
                                            setFormData({ ...formData, data: { ...formData.data, scenarios: newScen } });
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {scenario.clues.map((clue, cIdx) => (
                                    <input
                                        key={cIdx}
                                        type="text"
                                        placeholder={`Clue ${cIdx + 1}`}
                                        className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-lg px-3 py-2 text-quest-text text-sm focus:outline-none focus:border-quest-primary/50"
                                        value={clue}
                                        onChange={(e) => {
                                            const newScen = [...formData.data.scenarios];
                                            newScen[idx].clues[cIdx] = e.target.value;
                                            setFormData({ ...formData, data: { ...formData.data, scenarios: newScen } });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            const newScen = [...(formData.data.scenarios || [])];
                            newScen.push({ correctId: '', clues: ['', '', ''] });
                            setFormData({ ...formData, data: { ...formData.data, scenarios: newScen } });
                        }}
                        className="w-full py-2 border border-dashed dark:border-white/20 border-black/20 rounded-xl text-quest-muted hover:text-quest-text transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Scenario
                    </button>
                </div>
            </div>
        );
    };

    const renderSimpleModeForms = () => {
        const type = formData.gameType;
        if (['quiz', 'reverse-hangman', 'archery', 'snake'].includes(type)) {
            return renderQuizLikeForm();
        } else if (type === 'sorter') {
            return renderSorterForm();
        } else if (type === 'match' || type === 'memory') {
            return renderMatchForm();
        } else if (type === 'spin') {
            return renderSpinForm();
        } else if (type === 'guess') {
            return renderGuessForm();
        }
        return null;
    };

    if (loading) return <div className="p-24 text-center">Loading questions...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-quest-text mb-2">Question Manager</h1>
                    <p className="text-quest-muted">Add and edit dynamic questions for IP modules.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-quest-primary text-quest-text rounded-xl font-bold hover:bg-quest-primary/90 transition-all"
                >
                    <Plus size={20} />
                    Add New Question
                </button>
            </div>

            {isAdding && (
                <div className="mb-12 dark:bg-white/5 bg-black/5 backdrop-blur-md border dark:border-white/10 border-black/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-quest-text">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
                        <button onClick={() => setIsAdding(false)} className="text-quest-muted hover:text-quest-text transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-quest-muted text-sm font-medium mb-1">Module</label>
                                <select
                                    className="bg-quest-card text-quest-text w-full border dark:border-white/10 border-black/10 rounded-xl px-4 py-2 focus:outline-none focus:border-quest-primary/50 cursor-pointer"
                                    value={formData.moduleId}
                                    onChange={(e) => {
                                        const newModuleId = e.target.value;
                                        const firstGame = modulesData.find(m => m.id === newModuleId)?.games[0];
                                        setFormData({ 
                                            ...formData, 
                                            moduleId: newModuleId,
                                            levelIndex: 0,
                                            gameType: firstGame ? firstGame.type : 'quiz',
                                            difficulty: 'easy',
                                            data: getDefaultDataForGameType(firstGame ? firstGame.type : 'quiz', firstGame)
                                        });
                                        setIsExpertMode(false);
                                    }}
                                >
                                    {modules.map(m => <option key={m} value={m} className="bg-quest-card text-quest-text">{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-quest-muted text-sm font-medium mb-1">Target Level</label>
                                <select
                                    className="bg-quest-card text-quest-text w-full border dark:border-white/10 border-black/10 rounded-xl px-4 py-2 focus:outline-none focus:border-quest-primary/50 cursor-pointer"
                                    value={formData.levelIndex}
                                    onChange={(e) => {
                                        const newLevelIdx = parseInt(e.target.value);
                                        const selectedGame = modulesData.find(m => m.id === formData.moduleId)?.games[newLevelIdx];
                                        if (selectedGame) {
                                            setFormData({ 
                                                ...formData, 
                                                levelIndex: newLevelIdx,
                                                gameType: selectedGame.type,
                                                difficulty: newLevelIdx <= 2 ? 'easy' : newLevelIdx <= 5 ? 'medium' : 'hard',
                                                data: getDefaultDataForGameType(selectedGame.type, selectedGame)
                                            });
                                            setIsExpertMode(false);
                                        }
                                    }}
                                >
                                    {modulesData.find(m => m.id === formData.moduleId)?.games.map((g, idx) => (
                                        <option key={idx} value={idx} className="bg-quest-card text-quest-text">
                                            Level {idx + 1}: {g.title} ({g.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-quest-muted text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl px-4 py-2 text-quest-text focus:outline-none focus:border-quest-primary/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-quest-muted text-sm font-medium">Game Data</label>
                                <button
                                    type="button"
                                    onClick={() => setIsExpertMode(!isExpertMode)}
                                    className="text-xs text-quest-primary font-bold hover:underline"
                                >
                                    {isExpertMode ? 'Switch to Simple Mode' : 'Switch to Expert Mode (JSON)'}
                                </button>
                            </div>

                            {!isExpertMode ? (
                                renderSimpleModeForms()
                            ) : (
                                <textarea
                                    className="w-full h-64 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl px-4 py-2 text-quest-text font-mono text-sm focus:outline-none focus:border-quest-primary/50"
                                    value={typeof formData.data === 'string' ? formData.data : JSON.stringify(formData.data, null, 2)}
                                    onChange={(e) => handleDataChange(e.target.value)}
                                    placeholder='{ "questions": [...] }'
                                    required
                                />
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-quest-primary text-quest-text rounded-xl font-bold hover:bg-quest-primary/90 transition-all"
                                >
                                    <Save size={20} />
                                    {editingId ? 'Update Question' : 'Save Question'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 dark:bg-white/5 bg-black/5 text-quest-text border dark:border-white/10 border-black/10 rounded-xl font-bold hover:dark:bg-white/10 bg-black/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => (
                    <div key={q._id} className="dark:bg-white/5 bg-black/5 backdrop-blur-md border dark:border-white/10 border-black/10 p-6 rounded-2xl group hover:border-quest-primary/50 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-quest-primary/20 text-quest-primary font-bold mb-2 inline-block`}>
                                    {q.moduleId} • {q.difficulty} • {q.levelIndex === -1 ? 'Appended' : `Level ${q.levelIndex + 1}`}
                                </span>
                                <h3 className="text-lg font-bold text-quest-text group-hover:text-quest-primary transition-colors">{q.title}</h3>
                                <p className="text-quest-muted text-sm">{q.gameType}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(q)}
                                    className="p-2 dark:bg-white/5 bg-black/5 hover:bg-quest-primary/20 text-quest-muted hover:text-quest-text rounded-lg transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(q._id)}
                                    className={`p-2 dark:bg-white/5 bg-black/5 rounded-lg transition-all ${q.isStatic ? 'opacity-50 cursor-not-allowed hover:bg-black/5 text-quest-muted' : 'hover:bg-red-500/20 text-quest-muted hover:text-red-500'}`}
                                    title={q.isStatic ? "Default levels cannot be deleted. Click Edit to override." : "Delete"}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionManager;
