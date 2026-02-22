'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function getUserId() {
    const cookieStore = await cookies()
    return cookieStore.get('expense_user_id')?.value
}

// --- CATEGORIES ---

export async function getCategories() {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return []

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name')

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }
    return data
}

export async function createCategory(name: string) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return { error: "Unauthorized" }

    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: userId }])
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/categories')
    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { data }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/categories')
    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { success: true }
}

// --- TRANSACTIONS ---

export async function getTransactions() {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return []

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            categories (
                name
            )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })

    if (error) {
        console.error("Error fetching transactions:", error)
        return []
    }
    return data
}

export async function createTransaction(transaction: {
    category_id?: string | null,
    amount: number,
    type: 'income' | 'expense',
    date: string,
    notes?: string
}) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return { error: "Unauthorized" }

    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            ...transaction,
            user_id: userId
        }])
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { data }
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/transactions')
    revalidatePath('/dashboard')
    revalidatePath('/budgets')
    return { success: true }
}

// --- BUDGETS ---

export async function getBudgets(month: number, year: number) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return []

    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            categories (
                name
            )
        `)
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)

    if (error) {
        console.error("Error fetching budgets:", error)
        return []
    }
    return data
}

export async function createOrUpdateBudget(budget: {
    category_id: string | null,
    monthly_limit: number,
    month: number,
    year: number
}) {
    const supabase = await createClient()
    const userId = await getUserId()
    if (!userId) return { error: "Unauthorized" }

    // Check if budget exists for this category/month/year
    let query = supabase
        .from('budgets')
        .select('id')
        .eq('user_id', userId)
        .eq('month', budget.month)
        .eq('year', budget.year)

    if (budget.category_id) {
        query = query.eq('category_id', budget.category_id)
    } else {
        query = query.is('category_id', null)
    }

    const { data: existingBudget } = await query.single()

    let error;

    if (existingBudget) {
        // Update
        const res = await supabase
            .from('budgets')
            .update({ monthly_limit: budget.monthly_limit })
            .eq('id', existingBudget.id)
            .eq('user_id', userId)
        error = res.error
    } else {
        // Insert
        const res = await supabase
            .from('budgets')
            .insert([{
                category_id: budget.category_id || null,
                monthly_limit: budget.monthly_limit,
                month: budget.month,
                year: budget.year,
                user_id: userId
            }])
        error = res.error
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/budgets')
    revalidatePath('/dashboard')
    return { success: true }
}
