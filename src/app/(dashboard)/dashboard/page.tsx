"use client";

import { useState, useEffect } from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { ChartCard } from "@/components/ChartCard";
import { TransactionTable } from "@/components/TransactionTable";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTransactions, getCategories } from "../../actions/database";
import { Transaction, Category } from "@/types";

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([getTransactions(), getCategories()]).then(([txs, cats]) => {
            const mappedTxs = (txs || []).map((t: any) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                categoryId: t.category_id,
                date: t.date,
                notes: t.notes
            }));
            setTransactions(mappedTxs);
            setCategories(cats as Category[] || []);
            setIsLoading(false);
        });
    }, []);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Aggregate monthly data for the chart
    const monthlyDataMap = new Map<string, { name: string; income: number; expense: number }>();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    transactions.forEach(t => {
        const d = new Date(t.date);
        const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthlyDataMap.has(monthKey)) {
            monthlyDataMap.set(monthKey, { name: monthNames[d.getMonth()], income: 0, expense: 0 });
        }
        const current = monthlyDataMap.get(monthKey)!;
        if (t.type === 'income') current.income += t.amount;
        else current.expense += t.amount;
    });

    // Take last 6 months minimum, sort chronologically
    const monthlyData = Array.from(monthlyDataMap.values()).reverse().slice(-7);

    // Aggregate category expenses for the pie chart
    const categoryExpenseMap = new Map<string, number>();
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const catId = t.categoryId;
        if (catId) {
            categoryExpenseMap.set(catId, (categoryExpenseMap.get(catId) || 0) + t.amount);
        }
    });

    const categoryData = Array.from(categoryExpenseMap.entries()).map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        return {
            name: cat ? cat.name : 'Unknown',
            value: amount,
            color: cat ? cat.color || '#3B82F6' : '#9ca3af'
        };
    }).sort((a, b) => b.value - a.value);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Welcome back, here is your financial overview.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Balance"
                    amount={balance}
                    icon={Wallet}
                    iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                />
                <SummaryCard
                    title="Total Income"
                    amount={totalIncome}
                    icon={TrendingUp}
                    iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                />
                <SummaryCard
                    title="Total Expense"
                    amount={totalExpense}
                    icon={TrendingDown}
                    iconClassName="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Income vs Expense" className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
                            <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Spending by Category">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#171717' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        {categoryData.slice(0, 4).map(c => (
                            <div key={c.name} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                                {c.name}
                            </div>
                        ))}
                    </div>
                </ChartCard>
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Transactions</h2>
                </div>
                <TransactionTable transactions={transactions} categories={categories} limit={5} />
            </div>
        </div>
    );
}
