'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtDecode } from "jwt-decode";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
): Promise<string | undefined> {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const { token, role } = await signIn(email as string, password as string);

        // Redirect based on role
        if (role === 'Manager') {
            redirect('/dashboard/manager');
        } else if (role === 'PersonalTrainer') {
            redirect('/dashboard/personalTrainer');
        } else if (role === 'Client') {
            redirect('/dashboard/client');
        } else {
            redirect('/');
        }
    } catch (err) {
        // NEXT_REDIRECT is a special error thrown by redirect()
        if ((err as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err;
        }
        return 'Invalid email or password.';
    }
}

async function signIn(
    email: string,
    password: string
): Promise<{ token: string; role: string }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/Users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error('Invalid credentials');
    }

    const token = data.jwt;
    const decoded = jwtDecode(token) as { Role?: string };
    const role = decoded?.Role || 'Unknown';

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: false,
        expires,
        sameSite: 'lax',
    });

    cookieStore.set('role', role, {
        httpOnly: false,
        secure: false,
        expires,
        sameSite: 'lax',
    });

    return { token, role };
}

export async function signOut(): Promise<never> {
    const cookieStore = await cookies();

    // Delete your custom auth cookies
    cookieStore.delete('token');
    cookieStore.delete('role');

    // Also delete NextAuth cookies if using them
    cookieStore.delete('authjs.session-token');
    cookieStore.delete('authjs.callback-url');
    cookieStore.delete('authjs.csrf-token');

    redirect('/');
}