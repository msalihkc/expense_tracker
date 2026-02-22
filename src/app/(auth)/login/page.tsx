"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useActionState, useEffect } from "react";
import { login } from "../../actions/auth";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const [state, formAction, pending] = useActionState(login, null);

    useEffect(() => {
        if (state?.success) {
            window.location.href = '/dashboard';
        }
    }, [state]);

    const displayMessage = state?.error || message;

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 pt-10 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-center text-sm">Enter your name and email to access your dashboard</p>
            </div>

            {displayMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-500/20">
                    {displayMessage}
                </div>
            )}

            <form action={formAction} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="john@example.com"
                    />
                </div>
                <button
                    disabled={pending}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 focus:ring-4 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                    {pending ? 'Entering...' : 'Enter Dashboard'}
                </button>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
