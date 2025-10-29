'use client';

import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    UserPlusIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavLinks() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);

    // Load role from localStorage when component mounts
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        } else {
            // Fallback: try to read from cookie
            const roleFromCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('role='))
                ?.split('=')[1];
            if (roleFromCookie) {
                setRole(decodeURIComponent(roleFromCookie));
                // Persist to localStorage for faster future access
                localStorage.setItem('role', decodeURIComponent(roleFromCookie));
            }
        }
    }, []);

    // Role-based navigation
    const links =
        role === 'Manager'
            ? [
                { name: 'Home', href: '/dashboard/manager', icon: HomeIcon },
                { name: 'Trainers', href: '/dashboard/manager/trainer', icon: UserGroupIcon },
            ]
            : role === 'PersonalTrainer'
                ? [
                    { name: 'Clients', href: '/dashboard/personalTrainer/clients', icon: UserGroupIcon },
                    { name: 'Workouts', href: '/dashboard/personalTrainer/workouts', icon: ClipboardDocumentListIcon },
                ]
                : role === 'Client'
                    ? [
                        { name: 'Home', href: '/dashboard', icon: HomeIcon },
                        { name: 'My Programs', href: '/dashboard/client/programs', icon: ClipboardDocumentListIcon },
                    ]
                    : [
                        { name: 'Home', href: '/dashboard', icon: HomeIcon }, // fallback
                    ];

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-sky-100 text-blue-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}