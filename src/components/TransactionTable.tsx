import { Transaction, Category } from "@/types";
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
    transactions: Transaction[];
    categories: Category[];
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transactionId: string) => void;
    limit?: number;
}

export function TransactionTable({ transactions, categories, onEdit, onDelete, limit }: TransactionTableProps) {
    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    const getCategory = (id: string) => categories.find(c => c.id === id);

    return (
        <div className="overflow-x-auto w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Notes</th>
                        <th className="px-6 py-4 font-medium text-right">Amount</th>
                        {(onEdit || onDelete) && <th className="px-6 py-4 font-medium text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {displayTransactions.map((tx) => {
                        const category = getCategory(tx.categoryId);
                        const isIncome = tx.type === 'income';

                        return (
                            <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center opacity-90 shadow-sm"
                                            style={{ backgroundColor: category?.color || '#ccc' }}
                                        >
                                            <span className="text-xs text-white font-bold">{category?.name?.charAt(0)}</span>
                                        </div>
                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{category?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">
                                    {tx.notes || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={cn(
                                        "font-semibold flex items-center justify-end gap-1.5 px-3 py-1 rounded-full inline-flex",
                                        isIncome ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" : "text-zinc-900 bg-zinc-100 dark:text-white dark:bg-zinc-800"
                                    )}>
                                        {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />}
                                        ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </td>
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onEdit && (
                                                <button onClick={() => onEdit(tx)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(tx.id)} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                    {displayTransactions.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-xl">📊</span>
                                    </div>
                                    <p>No transactions found.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
