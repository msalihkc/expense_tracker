"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Category } from "@/types";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onSubmit: (data: { categoryId: string | null; amount: number }) => void;
}

export function BudgetModal({ isOpen, onClose, categories, onSubmit }: BudgetModalProps) {
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setCategoryId(categories[0]?.id || '');
        }
    }, [isOpen, categories]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            categoryId: categoryId === 'overall' || categoryId === '' ? null : categoryId,
            amount: parseFloat(amount)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        Set Budget
                    </h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none"
                        >
                            <option value="overall">Overall (All Categories)</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Monthly Limit</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                            <input
                                type="number"
                                required
                                min="1"
                                step="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/20 outline-none"
                        >
                            Save Budget
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
