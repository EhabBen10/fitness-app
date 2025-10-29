
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';

import { Metadata } from 'next';
import Table from '@/app/ui/table';
import { fetchClient } from '@/app/lib/data';
import { CreateClient } from '@/app/ui/personaltrianer/buttons';

export const metadata: Metadata = {
    title: 'Invoices',
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const users = await fetchClient();

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="mb-8 flex w-full items-center justify-between">
                <div>
                    <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900`}>
                        Clients
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your fitness clients
                    </p>
                </div>
            </div>

            {/* Action Button */}
            <div className="mb-6">
                <CreateClient />
            </div>

            {/* Table Section */}
            <div className="rounded-lg bg-white shadow-sm">
                <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading trainers...</div>}>
                    <Table users={users} />
                </Suspense>
            </div>
        </div>
    );
}