import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
    title: string;
    amount: number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    iconClassName?: string;
}

export function SummaryCard({ title, amount, icon: Icon, trend, className, iconClassName }: SummaryCardProps) {
    return (
        <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800", iconClassName)}>
                    <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white pb-1">
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
            </div>
            {trend && (
                <div className="mt-2 text-sm flex items-center gap-2">
                    <span className={cn("font-medium px-2 py-0.5 rounded-full", trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400")}>
                        {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">vs last month</span>
                </div>
            )}
        </div>
    );
}
