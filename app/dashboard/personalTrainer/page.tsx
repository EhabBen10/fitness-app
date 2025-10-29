import { jwtDecode } from "jwt-decode";
import { cookies } from 'next/headers';
import { User } from '@/app/lib/definitions';

export default async function ManagerHomepage() {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('token');

    let TokenInfo = null;
    if (userToken) {
        TokenInfo = jwtDecode(userToken.value) as {
            PersonalTrainer?: User
        } | null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Personal Trainer Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Overview and tools for personal trainers
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="font-medium">
                            {(TokenInfo as any)?.PersonalTrainer?.name ?? (TokenInfo as any)?.FullName ?? 'Personal Trainer'}
                        </p>
                    </div>
                </div>

                <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Here you can manage your clients, track their progress, and customize workout plans. Use the tools below to enhance your clients' fitness journeys.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">User ID</h3>
                        <p className="font-medium">{(TokenInfo as any)?.PersonalTrainer?.id ?? (TokenInfo as any)?.UserId ?? '—'}</p>
                    </div>
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Role</h3>
                        <p className="font-medium">{(TokenInfo as any)?.PersonalTrainer?.role ?? (TokenInfo as any)?.Role ?? 'Personal Trainer'}</p>
                    </div>

                </div>

            </div>
        </div>
    );
}