"use client";

import { useState, useEffect, useTransition } from "react";
import { CategoryModal } from "@/components/CategoryModal";
import { Plus, Trash2 } from "lucide-react";
import { getCategories, createCategory, deleteCategory } from "../../actions/database";

type Category = {
    id: string;
    name: string;
    color: string;
}

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getCategories().then((data: any) => {
            setCategories(data || []);
            setIsLoading(false);
        });
    }, []);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        startTransition(async () => {
            const res = await deleteCategory(id);
            if (!res.error) {
                setCategories(cats => cats.filter(c => c.id !== id));
            } else {
                alert(res.error);
            }
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Categories</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your transaction categories.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">No categories found. Create one to get started!</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className={"bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group transition-shadow hover:shadow-md " + (isPending ? "opacity-50 pointer-events-none" : "")}>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-90 shadow-sm"
                                    style={{ backgroundColor: category.color || '#3B82F6' }}
                                >
                                    <span className="text-sm text-white font-bold">{category.name.charAt(0)}</span>
                                </div>
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{category.name}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={async (data) => {
                    startTransition(async () => {
                        const res = await createCategory(data.name, data.color);
                        if (res.data) {
                            setCategories(prev => [...prev, res.data as Category]);
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
