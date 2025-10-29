'use client';

import Link from 'next/link';
import {
    AtSymbolIcon,
    UserCircleIcon,
    ExclamationCircleIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { createUser } from '@/app/lib/data';
import { jwtDecode } from 'jwt-decode';
import { User } from '../lib/definitions';

type FormState = {
    message: string | null;
    errors: Record<string, string[]>;
};

interface CreateUserFormProps {
    userId?: string | null;
}

export default function CreateUserForm({ userId }: CreateUserFormProps) {
    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initialState: FormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createUser, initialState);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setCurrentRole(role);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="p-4 text-gray-600">Loading...</div>;
    }

    // Decide what role the new user can be
    const allowedRole =
        currentRole === 'Manager' ? 'PersonalTrainer' :
            currentRole === 'PersonalTrainer' ? 'Client' : null;

    if (!allowedRole) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-red-600">
                You do not have permission to create new users.
            </div>
        );
    }

    const cancelRoute =
        currentRole === 'Manager' ? '/dashboard/manager/trainer' :
            currentRole === 'PersonalTrainer' ? '/dashboard/personalTrainer/clients' :
                '/dashboard';

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* First Name */}
                <div className="mb-4">
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                        First Name
                    </label>
                    <div className="relative">
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Enter first name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="firstName-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="firstName-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.firstName &&
                            state.errors.firstName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                        Last Name
                    </label>
                    <div className="relative">
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter last name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="lastName-error"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="lastName-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.lastName &&
                            state.errors.lastName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="email-error"
                        />
                        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="password-error"
                        />
                        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    <div id="password-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.password &&
                            state.errors.password.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Account Type */}
                <input type="hidden" name="accountType" value={allowedRole} />
                {/* Personal Trainer ID */}
                {userId && <input type="hidden" name="personalTrainerId" value={userId} />}
                {/* Info message */}
                <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                    {currentRole === 'Manager'
                        ? 'You are creating a Personal Trainer account.'
                        : 'You are creating a Client account.'}
                </div>



                {/* General Error Message */}
                {state.message && (
                    <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-600">{state.message}</p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={cancelRoute}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create User</Button>
            </div>
        </form>
    );
}