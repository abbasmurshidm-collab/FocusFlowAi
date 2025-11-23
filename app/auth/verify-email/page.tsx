'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { EnvelopeOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

function VerifyEmailContent() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            router.push('/auth/login');
        }
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        try {
            await verifyEmail(email, code);
        } catch (error) {
            setLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl float-animation"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 md:p-10">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <EnvelopeOpenIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">
                            Verify Email
                        </h1>
                        <p className="text-gray-400">
                            We sent a code to <span className="text-white font-medium">{email}</span>
                        </p>
                    </div>

                    {/* Verification Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium mb-2">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                required
                                maxLength={6}
                                className="w-full text-center text-2xl tracking-[0.5em] font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Enter the 6-digit code from your email
                            </p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </span>
                            ) : (
                                'Verify Email'
                            )}
                        </motion.button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                            ← Back to login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
