"use client";

import { useState, useRef } from "react";
import { updateUserProfile } from "@/app/actions/database";
import { createClient } from "@/utils/supabase/client";
import { User } from "lucide-react";

interface SettingsFormProps {
    initialProfile: {
        name: string;
        email: string;
        avatar_url: string | null;
    };
}

export default function SettingsForm({ initialProfile }: SettingsFormProps) {
    const supabase = createClient();
    const [name, setName] = useState(initialProfile.name);
    const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const res = await updateUserProfile({ name, avatar_url: avatarUrl });

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
        }
        setIsSaving(false);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setMessage(null);

        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Auto save profile on avatar upload
            await updateUserProfile({ name, avatar_url: publicUrl });
            setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });

        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            setMessage({ type: 'error', text: "Failed to upload avatar: " + error.message });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Profile Information</h2>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-5 max-w-md">
                    <div className="flex items-center gap-5 mb-8">
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={name}
                                    className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-800 shadow-sm object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full border-4 border-zinc-100 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shadow-sm">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-sm font-medium rounded-lg text-zinc-900 dark:text-white transition-colors disabled:opacity-50">
                            {isUploading ? 'Uploading...' : 'Change Avatar'}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={initialProfile.email}
                            disabled
                            className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-500 cursor-not-allowed outline-none transition-all"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Email cannot be changed.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving || isUploading}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
