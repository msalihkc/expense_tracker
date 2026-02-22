import { cn } from "@/lib/utils";

interface BudgetCardProps {
    categoryName: string;
    categoryColor: string;
    spent: number;
    limit: number;
}

export function BudgetCard({ categoryName, categoryColor, spent, limit }: BudgetCardProps) {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOverBudget = spent > limit;
    const remaining = limit - spent;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                    />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{categoryName}</h3>
                </div>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    ${spent.toLocaleString('en-US', { minimumFractionDigits: 0 })} / ${limit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
            </div>

            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", isOverBudget ? "bg-rose-500" : "")}
                    style={{
                        width: `${percentage}%`,
                        ...(isOverBudget ? {} : { backgroundColor: categoryColor })
                    }}
                />
            </div>

            <div className="flex justify-between items-center text-sm">
                <span className={cn(isOverBudget ? "text-rose-500 font-medium" : "text-emerald-600 dark:text-emerald-400 font-medium")}>
                    {isOverBudget ? 'Over budget' : 'On track'}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    {isOverBudget
                        ? <><span className="font-semibold text-rose-500">${Math.abs(remaining).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span> over</>
                        : <><span className="font-semibold text-zinc-900 dark:text-zinc-100">${remaining.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span> left</>}
                </span>
            </div>
        </div>
    );
}
