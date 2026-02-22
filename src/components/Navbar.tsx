"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Sun, Moon, Menu, User } from "lucide-react";
import { getUserProfile } from "@/app/actions/database";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profile, setProfile] = useState<{ name: string; avatar_url: string | null } | null>(null);

    useEffect(() => {
        // Check initial user preference or system preference
        if (typeof window !== "undefined") {
            const isDark = document.documentElement.classList.contains("dark") ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDarkMode(isDark);
            if (isDark) {
                document.documentElement.classList.add("dark");
            }
        }

        // Fetch user profile
        const fetchProfile = async () => {
            const userProfile = await getUserProfile();
            if (userProfile) {
                setProfile({ name: userProfile.name, avatar_url: userProfile.avatar_url });
            }
        };
        fetchProfile();
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200 z-10 relative">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg max-w-sm w-full border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <Search className="w-4 h-4 text-zinc-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="bg-transparent border-none outline-none text-sm w-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                </button>

                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity pl-1">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile?.name || "User avatar"}
                            className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white leading-tight">
                            {profile?.name || "Loading..."}
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}
