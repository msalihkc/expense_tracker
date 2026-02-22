"use client";

import { useState, useEffect, useTransition } from "react";
import { BudgetCard } from "@/components/BudgetCard";
import { Plus } from "lucide-react";
import { getBudgets, getTransactions, getCategories, createOrUpdateBudget } from "../../actions/database";
import { Category, Transaction } from "@/types";
import { BudgetModal } from "@/components/BudgetModal";

type DBBudget = any;
type DBTransaction = any;

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<DBBudget[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        Promise.all([
            getBudgets(currentMonth, currentYear),
            getTransactions(),
            getCategories()
        ]).then(([bData, tData, cData]) => {
            const mappedTxs = (tData || []).map((t: DBTransaction) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                categoryId: t.category_id,
                date: t.date,
                notes: t.notes
            }));

            setBudgets(bData || []);
            setTransactions(mappedTxs);
            setCategories(cData as Category[] || []);
            setIsLoading(false);
        });
    }, [currentMonth, currentYear]);

    const getSpentAmount = (categoryId: string | null) => {
        const currentMonthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

        return transactions
            .filter(t =>
                t.type === 'expense' &&
                t.date.startsWith(currentMonthStr) &&
                (categoryId === null || t.categoryId === categoryId)
            )
            .reduce((acc, t) => acc + t.amount, 0);
    };

    const getCategory = (id: string | null) => {
        if (!id) return { name: 'Overall Budget', color: '#6366F1' };
        return categories.find(c => c.id === id);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Budgets</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track your spending limits by category.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Set Budget
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : budgets.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">No budgets set for this month. Set one to get started!</div>
            ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                    {budgets.map((budget) => {
                        const category = getCategory(budget.category_id);
                        if (!category) return null;

                        const spent = getSpentAmount(budget.category_id);

                        return (
                            <BudgetCard
                                key={budget.id}
                                categoryName={category.name}
                                categoryColor={category.color || '#3B82F6'}
                                spent={spent}
                                limit={budget.monthly_limit}
                            />
                        );
                    })}
                </div>
            )}

            <BudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onSubmit={(data) => {
                    startTransition(async () => {
                        const res = await createOrUpdateBudget({
                            category_id: data.categoryId,
                            monthly_limit: data.amount,
                            month: currentMonth,
                            year: currentYear
                        });

                        if (res.success) {
                            // Optimistically reload page data by refetching budgets
                            const newBudgets = await getBudgets(currentMonth, currentYear);
                            setBudgets(newBudgets || []);
                            setIsModalOpen(false);
                        } else if (res.error) {
                            alert(res.error);
                        }
                    });
                }}
            />
        </div>
    );
}
