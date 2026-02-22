'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const name = formData.get('name') as string

    if (!email || !name) {
        return { error: 'Please provide both name and email' }
    }

    // Try finding the user
    let { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    // If no user exists, create one
    if (!user) {
        const res = await supabase
            .from('users')
            .insert([{ email, name }])
            .select('id')
            .single()

        user = res.data
        error = res.error
    }

    if (error || !user) {
        return { error: 'Could not log in. Database error.' }
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('expense_user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
    })

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('expense_user_id')

    revalidatePath('/', 'layout')
    return { success: true }
}
