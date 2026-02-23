"use client";

import { useState, useEffect, useTransition } from "react";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionModal } from "@/components/TransactionModal";
import { Plus } from "lucide-react";
import { getTransactions, getCategories, createTransaction, deleteTransaction } from "../../actions/database";
import { Transaction, Category } from "@/types";

type DBTransaction = any; // Supabase return type shape

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        Promise.all([getTransactions(), getCategories()]).then(([txs, cats]) => {
            // Map DB structure to frontend type
            const mappedTxs = (txs || []).map((t: DBTransaction) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                categoryId: t.category_id,
                date: t.date,
                paymentMode: t.payment_mode || 'Cash',
                notes: t.notes
            }));

            setTransactions(mappedTxs);
            setCategories(cats as Category[] || []);
            setIsLoading(false);
        });
    }, []);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        startTransition(async () => {
            const res = await deleteTransaction(id);
            if (!res.error) {
                setTransactions(prev => prev.filter(t => t.id !== id));
            } else {
                alert(res.error);
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Transactions</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage and view all your income and expenses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Transaction
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
                    <TransactionTable
                        transactions={transactions}
                        categories={categories}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onSubmit={async (data) => {
                    startTransition(async () => {
                        const res = await createTransaction({
                            amount: data.amount!,
                            type: data.type!,
                            category_id: data.categoryId,
                            date: data.date!,
                            payment_mode: data.paymentMode || 'Cash',
                            notes: data.notes
                        } as any);

                        if (res.data) {
                            const newTx = {
                                id: res.data.id,
                                amount: res.data.amount,
                                type: res.data.type,
                                categoryId: res.data.category_id,
                                date: res.data.date,
                                paymentMode: res.data.payment_mode || 'Cash',
                                notes: res.data.notes
                            };
                            setTransactions(prev => [newTx, ...prev]);
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
