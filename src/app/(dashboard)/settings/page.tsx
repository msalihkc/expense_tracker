"use client";

import { useState } from "react";
import { mockUser } from "@/lib/mockData";

export default function SettingsPage() {
    const [name, setName] = useState(mockUser.name);
    const [email, setEmail] = useState(mockUser.email);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Save profile", { name, email });
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Save password", { currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and profile.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 sm:p-8">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Profile Information</h2>
                    <form onSubmit={handleProfileSave} className="space-y-5 max-w-md">
                        <div className="flex items-center gap-5 mb-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={mockUser.avatarUrl}
                                alt={mockUser.name}
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-800 shadow-sm object-cover"
                            />
                            <button type="button" className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm font-medium rounded-lg text-zinc-900 dark:text-white transition-colors">
                                Change Avatar
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="p-6 sm:p-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Change Password</h2>
                    <form onSubmit={handlePasswordSave} className="space-y-5 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <button type="submit" className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium rounded-lg transition-colors">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
