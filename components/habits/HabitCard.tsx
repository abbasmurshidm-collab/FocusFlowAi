'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, FireIcon, TrashIcon } from '@heroicons/react/24/outline';
import { IHabit } from '@/models/Habit';

interface HabitCardProps {
    habit: IHabit;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onComplete, onDelete }: HabitCardProps) {
    const [isCompleting, setIsCompleting] = useState(false);

    const isCompletedToday = habit.completedDates.some((date) => {
        const d = new Date(date);
        const today = new Date();
        return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        );
    });

    const handleComplete = async () => {
        if (isCompletedToday) return;
        setIsCompleting(true);
        await onComplete(habit._id as string);
        setIsCompleting(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`glass-card p-6 relative overflow-hidden group ${isCompletedToday ? 'border-green-500/30 bg-green-500/5' : ''
                }`}
        >
            {/* Progress Bar Background */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${Math.min(habit.streak * 10, 100)}%` }}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                            {habit.category}
                        </span>
                        <span className="text-xs text-gray-500">
                            {habit.frequency}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{habit.title}</h3>
                    {habit.description && (
                        <p className="text-sm text-gray-400 mb-4">{habit.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5 text-orange-400">
                            <FireIcon className="w-4 h-4" />
                            <span className="font-medium">{habit.streak} day streak</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={handleComplete}
                        disabled={isCompletedToday || isCompleting}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isCompletedToday
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                            : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                            }`}
                    >
                        {isCompleting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CheckIcon className="w-6 h-6" />
                        )}
                    </button>

                    <button
                        onClick={() => onDelete(String(habit._id))}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
