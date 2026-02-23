"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ArrowRightLeft,
    Tags,
    PieChart,
    Settings,
    Wallet,
    LogOut,
    Bell,
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
    { name: "Categories", href: "/categories", icon: Tags },
    { name: "Budgets", href: "/budgets", icon: PieChart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen flex flex-col transition-colors duration-200">
            <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-white">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                    <span>Expenso</span>
                </Link>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5",
                                    isActive
                                        ? "text-blue-700 dark:text-blue-400"
                                        : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={async () => {
                        const res = await logout();
                        if (res?.success) window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
