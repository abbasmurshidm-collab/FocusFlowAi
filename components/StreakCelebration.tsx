'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FireIcon, XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface StreakCelebrationProps {
    show: boolean;
    streakCount: number;
    onClose: () => void;
}

export default function StreakCelebration({ show, streakCount, onClose }: StreakCelebrationProps) {
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

    useEffect(() => {
        if (show) {
            // Generate confetti particles
            const particles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#b794f6'][Math.floor(Math.random() * 5)]
            }));
            setConfetti(particles);

            // Auto close after 4 seconds
            const timer = setTimeout(() => onClose(), 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const getMilestoneMessage = (streak: number) => {
        if (streak === 1) return { title: "🎉 Streak Started!", message: "You've begun your journey!" };
        if (streak === 3) return { title: "🔥 3 Day Streak!", message: "You're building momentum!" };
        if (streak === 7) return { title: "⭐ Week Streak!", message: "One full week of consistency!" };
        if (streak === 14) return { title: "💎 2 Week Warrior!", message: "You're unstoppable!" };
        if (streak === 30) return { title: "👑 Monthly Master!", message: "30 days of excellence!" };
        if (streak === 100) return { title: "🏆 Century Champion!", message: "Legendary dedication!" };
        if (streak % 10 === 0) return { title: `🔥 ${streak} Day Streak!`, message: "Keep the fire burning!" };
        return { title: `🔥 ${streak} Day Streak!`, message: "Stay consistent, stay strong!" };
    };

    const milestone = getMilestoneMessage(streakCount);

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="glass-card p-8 max-w-md w-full text-center relative overflow-hidden">
                            {/* Animated background glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl"
                            />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-10"
                            >
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            </button>

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Animated fire icon */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                    className="inline-block mb-4"
                                >
                                    {streakCount >= 100 ? (
                                        <TrophyIcon className="w-24 h-24 text-yellow-400 mx-auto" />
                                    ) : (
                                        <FireIcon className="w-24 h-24 text-orange-400 mx-auto" />
                                    )}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-bold mb-2 gradient-text"
                                >
                                    {milestone.title}
                                </motion.h2>

                                {/* Streak count */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="text-7xl font-black text-orange-400 my-6"
                                >
                                    {streakCount}
                                </motion.div>

                                {/* Message */}
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl text-gray-300 mb-6"
                                >
                                    {milestone.message}
                                </motion.p>

                                {/* Motivational quote */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="p-4 rounded-xl bg-white/5 border border-orange-500/20"
                                >
                                    <p className="text-sm text-gray-400 italic">
                                        {getMotivationalQuote(streakCount)}
                                    </p>
                                </motion.div>

                                {/* Continue button */}
                                <motion.button
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="mt-6 btn-primary w-full py-3"
                                >
                                    Keep Going! 🚀
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function getMotivationalQuote(streak: number): string {
    const quotes = [
        "Consistency is the key to mastery.",
        "Small daily improvements lead to stunning results.",
        "You're building discipline, one day at a time.",
        "Excellence is not an act, but a habit.",
        "Success is the sum of small efforts repeated daily.",
        "Your dedication is inspiring!",
        "Keep pushing forward, you're doing amazing!",
        "Champions are made in the daily grind.",
        "Discipline is choosing what you want most over what you want now.",
        "You're proof that consistency beats talent."
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
}
