'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import {
    PlusIcon,
    SparklesIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import StreakCelebration from '@/components/StreakCelebration';
import { useStreakCelebration } from '@/lib/useStreakCelebration';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
    tags?: string[];
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [newTask, setNewTask] = useState<{
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        tags: string;
    }>({
        title: '',
        description: '',
        priority: 'medium',
        tags: '',
    });
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);

    // Streak celebration
    const { showCelebration, celebrationStreak, closeCelebration } = useStreakCelebration(tasks);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks);
            }
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTask.title.trim()) {
            toast.error('Task title is required');
            return;
        }

        try {
            const url = editingTaskId ? `/api/tasks/${editingTaskId}` : '/api/tasks';
            const method = editingTaskId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    priority: newTask.priority,
                    tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingTaskId) {
                    setTasks(tasks.map(t => t._id === editingTaskId ? data.task : t));
                    toast.success('Task updated successfully! ✨');
                } else {
                    setTasks([data.task, ...tasks]);
                    toast.success('Task created successfully! 🎉');
                }
                setNewTask({ title: '', description: '', priority: 'medium', tags: '' });
                setEditingTaskId(null);
                setShowCreateModal(false);

                // Refresh tasks to trigger streak check
                await fetchTasks();
            }
        } catch (error) {
            toast.error(editingTaskId ? 'Failed to update task' : 'Failed to create task');
        }
    };

    const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
        // If updates is empty, it means "Edit" button was clicked
        if (Object.keys(updates).length === 0) {
            const taskToEdit = tasks.find(t => t._id === id);
            if (taskToEdit) {
                setNewTask({
                    title: taskToEdit.title,
                    description: taskToEdit.description,
                    priority: taskToEdit.priority,
                    tags: taskToEdit.tags ? taskToEdit.tags.join(', ') : '',
                });
                setEditingTaskId(id);
                setShowCreateModal(true);
            }
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(tasks.map(t => t._id === id ? data.task : t));

                if (updates.status === 'completed') {
                    toast.success('Task completed! 🎉');
                    // Refresh tasks to trigger streak check
                    await fetchTasks();
                }
            }
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTasks(tasks.filter(t => t._id !== id));
                toast.success('Task deleted');
            }
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleAITaskBreakdown = async () => {
        if (!newTask.title.trim()) {
            toast.error('Please enter a task title first!');
            return;
        }

        setGeneratingAI(true);
        try {
            const response = await fetch('/api/ai/plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks: [newTask.title + (newTask.description ? ': ' + newTask.description : '')]
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAiSuggestion(data.plan);
                toast.success('AI suggestions generated! ✨');
            } else {
                toast.error('Failed to generate AI suggestions');
            }
        } catch (error) {
            toast.error('AI service unavailable');
        } finally {
            setGeneratingAI(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const filterButtons = [
        { label: 'All', value: 'all' as const, count: tasks.length },
        { label: 'To Do', value: 'todo' as const, count: tasks.filter(t => t.status === 'todo').length },
        { label: 'In Progress', value: 'in-progress' as const, count: tasks.filter(t => t.status === 'in-progress').length },
        { label: 'Completed', value: 'completed' as const, count: tasks.filter(t => t.status === 'completed').length },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64 rounded-xl"></div>
                <div className="skeleton h-48 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                        <span className="gradient-text">Tasks</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Manage your tasks and boost productivity</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setNewTask({ title: '', description: '', priority: 'medium', tags: '' });
                            setEditingTaskId(null);
                            setAiSuggestion('');
                            setShowAIModal(true);
                        }}
                        className="btn-secondary flex-1 md:flex-none flex items-center justify-center gap-2 py-3"
                    >
                        <SparklesIcon className="w-5 h-5 text-accent" />
                        <span className="md:inline">AI Assistant</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setNewTask({ title: '', description: '', priority: 'medium', tags: '' });
                            setEditingTaskId(null);
                            setShowCreateModal(true);
                        }}
                        className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 py-3"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="md:inline">New Task</span>
                    </motion.button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass-card p-4 md:p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 py-3"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {filterButtons.map(({ label, value, count }) => (
                        <motion.button
                            key={value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFilter(value)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium whitespace-nowrap transition-all text-sm md:text-base ${filter === value
                                ? 'bg-gradient-to-r from-primary to-accent text-white'
                                : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            {label} ({count})
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card p-8 md:p-12 text-center"
                        >
                            <SparklesIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-2">No tasks found</h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base">
                                {filter === 'all' ? 'Create your first task to get started!' : `No ${filter} tasks yet`}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary"
                            >
                                Create Task
                            </motion.button>
                        </motion.div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create/Edit Task Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="glass-card p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                                    <SparklesIcon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                                    {editingTaskId ? 'Edit Task' : 'Create New Task'}
                                </h2>

                                <form onSubmit={handleSaveTask} className="space-y-6">
                                    {/* ... form fields remain same but with responsive padding if needed ... */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Task Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            placeholder="e.g., Finish project proposal"
                                            className="w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            placeholder="Add more details..."
                                            rows={4}
                                            className="w-full resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Priority
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['low', 'medium', 'high'] as const).map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() => setNewTask({ ...newTask, priority })}
                                                    className={`py-2 md:py-3 rounded-xl font-medium capitalize transition-all text-sm md:text-base ${newTask.priority === priority
                                                        ? priority === 'high' ? 'bg-red-400/20 text-red-400 border-2 border-red-400' :
                                                            priority === 'medium' ? 'bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400' :
                                                                'bg-blue-400/20 text-blue-400 border-2 border-blue-400'
                                                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                                                        }`}
                                                >
                                                    {priority}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.tags}
                                            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                                            placeholder="e.g., work, urgent, research"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 btn-primary py-3 md:py-4"
                                        >
                                            {editingTaskId ? 'Update Task' : 'Create Task'}
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setEditingTaskId(null);
                                                setNewTask({ title: '', description: '', priority: 'medium', tags: '' });
                                            }}
                                            className="flex-1 btn-secondary py-3 md:py-4"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* AI Assistant Modal */}
            <AnimatePresence>
                {showAIModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAIModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="glass-card p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                                    <SparklesIcon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                                    AI Task Assistant
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            What's your goal?
                                        </label>
                                        <textarea
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            placeholder="e.g., Plan a marketing campaign for the new product launch..."
                                            rows={3}
                                            className="w-full resize-none"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAITaskBreakdown}
                                        disabled={generatingAI || !newTask.title.trim()}
                                        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <SparklesIcon className="w-5 h-5" />
                                        {generatingAI ? 'Analyzing...' : 'Generate Task Plan'}
                                    </motion.button>

                                    {aiSuggestion && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-card p-4 md:p-6 border border-accent/20"
                                        >
                                            <h3 className="font-semibold text-accent mb-4 flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5" />
                                                Suggested Plan:
                                            </h3>

                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                                {(() => {
                                                    try {
                                                        const jsonMatch = aiSuggestion.match(/\[[\s\S]*\]/);
                                                        const content = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiSuggestion);

                                                        if (Array.isArray(content)) {
                                                            return content.map((item: any, i: number) => (
                                                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-accent/50 transition-colors group">
                                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                                                                        <h4 className="font-medium text-white">{item.task}</h4>
                                                                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                                            item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                                'bg-blue-500/20 text-blue-400'
                                                                            }`}>{item.priority}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-400 mb-3">{item.tips}</p>
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 gap-2">
                                                                        <div className="flex gap-3">
                                                                            <span>⏱ {item.estimatedTime}</span>
                                                                            <span>📅 {item.deadline}</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                setNewTask({
                                                                                    title: item.task,
                                                                                    description: item.tips,
                                                                                    priority: item.priority,
                                                                                    tags: 'ai-generated'
                                                                                });
                                                                                setShowAIModal(false);
                                                                                setShowCreateModal(true);
                                                                            }}
                                                                            className="text-accent hover:text-white transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                                        >
                                                                            Use this task →
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ));
                                                        }
                                                        throw new Error('Not an array');
                                                    } catch (e) {
                                                        return (
                                                            <div className="prose prose-invert prose-sm">
                                                                <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={() => setShowAIModal(false)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Streak Celebration Popup */}
            <StreakCelebration
                show={showCelebration}
                streakCount={celebrationStreak}
                onClose={closeCelebration}
            />
        </div>
    );
}
