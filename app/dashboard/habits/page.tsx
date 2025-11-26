'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import HabitCard from '@/components/habits/HabitCard';
import CreateHabitModal from '@/components/habits/CreateHabitModal';
import { IHabit } from '@/models/Habit';

export default function HabitsPage() {
    const [habits, setHabits] = useState<IHabit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalActive: 0,
        completedToday: 0,
        longestStreak: 0,
    });

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits');
            const data = await res.json();
            if (data.habits) {
                setHabits(data.habits);
                calculateStats(data.habits);
            }
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (habitList: IHabit[]) => {
        const today = new Date();
        let completed = 0;
        let maxStreak = 0;

        habitList.forEach(habit => {
            if (habit.streak > maxStreak) maxStreak = habit.streak;

            const isCompletedToday = habit.completedDates.some((date) => {
                const d = new Date(date);
                return (
                    d.getDate() === today.getDate() &&
                    d.getMonth() === today.getMonth() &&
                    d.getFullYear() === today.getFullYear()
                );
            });
            if (isCompletedToday) completed++;
        });

        setStats({
            totalActive: habitList.length,
            completedToday: completed,
            longestStreak: maxStreak,
        });
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleCreateHabit = async (habitData: any) => {
        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(habitData),
            });

            if (res.ok) {
                fetchHabits();
            }
        } catch (error) {
            console.error('Error creating habit:', error);
        }
    };

    const handleCompleteHabit = async (id: string) => {
        try {
            const res = await fetch(`/api/habits/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completedDate: new Date() }),
            });

            if (res.ok) {
                fetchHabits();
                // Trigger confetti or sound here in future
            }
        } catch (error) {
            console.error('Error completing habit:', error);
        }
    };

    const handleDeleteHabit = async (id: string) => {
        if (!confirm('Are you sure you want to archive this habit?')) return;

        try {
            const res = await fetch(`/api/habits/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchHabits();
            }
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                        Habit Tracker
                    </h1>
                    <p className="text-gray-400">Build better habits, one day at a time.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Habit
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Completed Today</p>
                            <p className="text-2xl font-bold">
                                {stats.completedToday} / {stats.totalActive}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                            <FireIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Longest Streak</p>
                            <p className="text-2xl font-bold">{stats.longestStreak} days</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Completion Rate</p>
                            <p className="text-2xl font-bold">
                                {stats.totalActive > 0
                                    ? Math.round((stats.completedToday / stats.totalActive) * 100)
                                    : 0}
                                %
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Habits Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-6 h-48 skeleton rounded-2xl" />
                    ))}
                </div>
            ) : habits.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <PlusIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                    <p className="text-gray-400 mb-6">Start building your streak today!</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        Create First Habit
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map((habit) => (
                        <HabitCard
                            key={String(habit._id)}
                            habit={habit}
                            onComplete={handleCompleteHabit}
                            onDelete={handleDeleteHabit}
                        />
                    ))}
                </div>
            )}

            <CreateHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateHabit}
            />
        </div>
    );
}
