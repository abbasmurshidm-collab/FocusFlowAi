'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SparklesIcon,
    Squares2X2Icon,
    ListBulletIcon,
    DocumentTextIcon,
    FireIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
        { name: 'Tasks', href: '/dashboard/tasks', icon: ListBulletIcon },
        { name: 'Focus Timer', href: '/dashboard/focus', icon: ClockIcon },
        { name: 'Notes', href: '/dashboard/notes', icon: DocumentTextIcon },
        { name: 'Goals', href: '/dashboard/goals', icon: FireIcon },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-3 rounded-xl glass-card hover:bg-white/10 transition-colors"
                aria-label="Open menu"
            >
                <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileMenu}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile Drawer */}
            <AnimatePresence>
                <motion.aside
                    initial={false}
                    animate={{
                        x: isMobileMenuOpen ? 0 : '-100%',
                    }}
                    className={`
                        fixed lg:relative
                        top-0 left-0
                        w-72 lg:w-64
                        glass-card
                        lg:m-4 m-0
                        p-6
                        flex flex-col
                        h-screen lg:h-[calc(100vh-2rem)]
                        z-50 lg:z-auto
                        transition-transform lg:transition-none
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}
                >
                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobileMenu}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Close menu"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3 mb-8" onClick={closeMobileMenu}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold font-heading">FocusFlow AI</span>
                    </Link>

                    {/* User Info */}
                    <div className="glass-card p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px] ${isActive
                                                ? 'bg-gradient-to-r from-primary to-accent text-white'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-medium">{item.name}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            closeMobileMenu();
                            logout();
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all mt-4 min-h-[44px]"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </motion.button>
                </motion.aside>
            </AnimatePresence>
        </>
    );
}
