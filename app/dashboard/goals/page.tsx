'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    FireIcon,
    CheckCircleIcon,
    CalendarIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Goal {
    _id: string;
    title: string;
    description: string;
    targetDate: string;
    progress: number;
    milestones: {
        title: string;
        completed: boolean;
        completedAt?: string;
    }[];
    category: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        targetDate: '',
        category: 'personal',
        milestones: '',
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch('/api/goals');
            if (response.ok) {
                const data = await response.json();
                setGoals(data.goals);
            }
        } catch (error) {
            toast.error('Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGoal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newGoal.title.trim() || !newGoal.targetDate) {
            toast.error('Title and target date are required');
            return;
        }

        try {
            const milestones = newGoal.milestones
                ? newGoal.milestones.split('\n').filter(m => m.trim()).map(m => ({
                    title: m.trim(),
                    completed: false,
                }))
                : [];

            const url = editingGoalId ? `/api/goals/${editingGoalId}` : '/api/goals';
            const method = editingGoalId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newGoal.title,
                    description: newGoal.description,
                    targetDate: newGoal.targetDate,
                    category: newGoal.category,
                    milestones: editingGoalId ? undefined : milestones, // Don't overwrite milestones on edit
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingGoalId) {
                    setGoals(goals.map(g => g._id === editingGoalId ? data.goal : g));
                    toast.success('Goal updated successfully! 🎯');
                } else {
                    setGoals([data.goal, ...goals]);
                    toast.success('Goal created successfully! 🎯');
                }
                setNewGoal({ title: '', description: '', targetDate: '', category: 'personal', milestones: '' });
                setEditingGoalId(null);
                setShowCreateModal(false);
            }
        } catch (error) {
            toast.error(editingGoalId ? 'Failed to update goal' : 'Failed to create goal');
        }
    };

    const handleEditGoal = (goal: Goal) => {
        setNewGoal({
            title: goal.title,
            description: goal.description,
            targetDate: goal.targetDate.split('T')[0],
            category: goal.category,
            milestones: goal.milestones.map(m => m.title).join('\n'),
        });
        setEditingGoalId(goal._id);
        setShowCreateModal(true);
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGoals(goals.filter(g => g._id !== id));
                toast.success('Goal deleted');
            }
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const getDaysRemaining = (targetDate: string) => {
        const days = Math.ceil((new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="skeleton h-12 w-64 rounded-xl"></div>
                <div className="skeleton h-64 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                        <span className="gradient-text">Goals</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">Track your progress and achieve your dreams</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 py-3"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Goal
                </motion.button>
            </div>

            {/* Goals List */}
            <div className="space-y-4 md:space-y-6">
                <AnimatePresence mode="popLayout">
                    {goals.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card p-8 md:p-12 text-center"
                        >
                            <FireIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg md:text-xl font-semibold mb-2">No goals yet</h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base">Set your first goal and start achieving!</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary"
                            >
                                Create First Goal
                            </motion.button>
                        </motion.div>
                    ) : (
                        goals.map(goal => {
                            const daysRemaining = getDaysRemaining(goal.targetDate);
                            const completedMilestones = goal.milestones.filter(m => m.completed).length;
                            const totalMilestones = goal.milestones.length;
                            const progress = totalMilestones > 0
                                ? Math.round((completedMilestones / totalMilestones) * 100)
                                : 0;

                            const handleToggleMilestone = async (milestoneIndex: number) => {
                                const updatedMilestones = [...goal.milestones];
                                updatedMilestones[milestoneIndex].completed = !updatedMilestones[milestoneIndex].completed;
                                updatedMilestones[milestoneIndex].completedAt = updatedMilestones[milestoneIndex].completed ? new Date().toISOString() : undefined;

                                try {
                                    const response = await fetch(`/api/goals/${goal._id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ milestones: updatedMilestones }),
                                    });

                                    if (response.ok) {
                                        const data = await response.json();
                                        setGoals(goals.map(g => g._id === goal._id ? data.goal : g));
                                    }
                                } catch (error) {
                                    toast.error('Failed to update milestone');
                                }
                            };

                            return (
                                <motion.div
                                    key={goal._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="glass-card p-5 md:p-8"
                                >
                                    <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FireIcon className="w-6 h-6 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
                                                <h3 className="text-xl md:text-2xl font-bold break-words">{goal.title}</h3>
                                            </div>
                                            {goal.description && (
                                                <p className="text-gray-400 mb-4 text-sm md:text-base">{goal.description}</p>
                                            )}

                                            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4 text-blue-400" />
                                                    <span className="text-gray-400">
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className={`flex items-center gap-2 ${daysRemaining < 0 ? 'text-red-400' :
                                                    daysRemaining < 7 ? 'text-yellow-400' :
                                                        'text-green-400'
                                                    }`}>
                                                    <span>
                                                        {daysRemaining < 0
                                                            ? `${Math.abs(daysRemaining)} days overdue`
                                                            : `${daysRemaining} days remaining`
                                                        }
                                                    </span>
                                                </div>

                                                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs">
                                                    {goal.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                                            <button
                                                onClick={() => handleEditGoal(goal)}
                                                className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit Goal"
                                            >
                                                <PencilIcon className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGoal(goal._id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5 text-gray-400 hover:text-red-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="font-semibold">{progress}%</span>
                                        </div>
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                            />
                                        </div>
                                    </div>

                                    {/* Milestones */}
                                    {goal.milestones.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm md:text-base">
                                                <CheckCircleIcon className="w-5 h-5 text-accent" />
                                                Milestones ({completedMilestones}/{totalMilestones})
                                            </h4>
                                            <div className="space-y-2">
                                                {goal.milestones.map((milestone, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleToggleMilestone(index)}
                                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                                    >
                                                        {milestone.completed ? (
                                                            <CheckCircleSolid className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                        ) : (
                                                            <CheckCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        )}
                                                        <span className={`text-sm md:text-base ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                                                            {milestone.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Create Goal Modal */}
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
                                    <FireIcon className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                                    Create New Goal
                                </h2>

                                <form onSubmit={handleSaveGoal} className="space-y-5 md:space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Goal Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newGoal.title}
                                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                            placeholder="e.g., Learn Spanish"
                                            className="w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newGoal.description}
                                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                            placeholder="Describe your goal..."
                                            rows={3}
                                            className="w-full resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Target Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={newGoal.targetDate}
                                            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={newGoal.category}
                                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                            className="w-full"
                                        >
                                            <option value="personal">Personal</option>
                                            <option value="work">Work</option>
                                            <option value="health">Health</option>
                                            <option value="learning">Learning</option>
                                            <option value="financial">Financial</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Milestones (one per line)
                                        </label>
                                        <textarea
                                            value={newGoal.milestones}
                                            onChange={(e) => setNewGoal({ ...newGoal, milestones: e.target.value })}
                                            placeholder="Complete beginner course&#10;Practice daily for 30 days&#10;Have first conversation"
                                            rows={5}
                                            className="w-full resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 btn-primary py-3 md:py-4"
                                        >
                                            Create Goal
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
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
        </div>
    );
}
