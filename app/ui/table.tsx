'use client';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../lib/data';
import { User } from '../lib/definitions';
import Link from 'next/link';
import { CreateWorkout } from './personaltrianer/buttons';

export default function UsersTable({
    users
}: {
    users: User[];
}) {

    const [currentRole, setCurrentRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setCurrentRole(role);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="p-4 text-gray-600">Loading...</div>;
    }

    return (
        <div className="w-full">
            <div className="rounded-lg bg-gray-50 shadow-sm">

                {/* Desktop view */}
                <table className="w-full text-gray-900 text-center md:table">
                    <thead className="rounded-lg text-sm font-semibold bg-gray-100">
                        <tr>
                            <th scope="col" className="px-4 py-4 font-medium">
                                ID
                            </th>
                            <th scope="col" className="px-3 py-4 font-medium">
                                First Name
                            </th>
                            <th scope="col" className="px-3 py-4 font-medium">
                                Last Name
                            </th>
                            <th scope="col" className="px-3 py-4 font-medium">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-4 font-medium">
                                Role
                            </th>
                            {currentRole === 'PersonalTrainer' && (
                                <th scope="col" className="px-3 py-4 font-medium">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white text-center">
                        {users?.map((user) => (
                            <tr
                                key={user.userId}
                                className="border-b last:border-none text-sm hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">{user.userId}</td>
                                <td className="px-3 py-3">{user.firstName}</td>
                                <td className="px-3 py-3">{user.lastName}</td>
                                <td className="px-3 py-3">{user.email}</td>
                                <td className="px-3 py-3">{user.accountType}</td>
                                {currentRole === 'PersonalTrainer' && (
                                    <td className="px-3 py-3">
                                        <CreateWorkout userId={user.userId} />

                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty state */}
                {users?.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-8">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}