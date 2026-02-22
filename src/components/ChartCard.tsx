"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
    return (
        <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full", className)}>
            <div className="mb-6 flex-shrink-0">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
            </div>
            <div className="flex-1 w-full min-h-[300px]">
                {children}
            </div>
        </div>
    );
}
