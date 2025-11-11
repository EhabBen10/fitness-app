import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { User, WorkoutFormData } from "@/app/lib/definitions";
import { fetchWorkouts } from "@/app/lib/data";
import ClientWorkoutList from "../client/ClientWorkoutList";

export default async function ClientHomepage() {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("token");

    let TokenInfo = null;
    if (userToken) {
        TokenInfo = jwtDecode(userToken.value) as {
            Client?: User;
            name?: string;
            UserId?: number;
            Role?: string;
            FullName?: string;
        } | null;
    }

    let workouts: WorkoutFormData[] = [];
    try {
        workouts = await fetchWorkouts();
    } catch (error) {
        console.error("Error fetching workouts:", error);
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Client Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Overview and tools for clients
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Signed in as
                        </p>
                        <p className="font-medium">
                            {(TokenInfo as any)?.Client?.name ??
                                (TokenInfo as any)?.FullName ??
                                "Client"}
                        </p>
                    </div>
                </div>

                <p className="mb-6 text-gray-700 dark:text-gray-300">
                    Here you can see your programs
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">User ID</h3>
                        <p className="font-medium">
                            {(TokenInfo as any)?.Client?.id ??
                                (TokenInfo as any)?.UserId ??
                                "—"}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Role</h3>
                        <p className="font-medium">
                            {(TokenInfo as any)?.Client?.role ??
                                (TokenInfo as any)?.Role ??
                                "Client"}
                        </p>
                    </div>
                </div>

                <ClientWorkoutList workouts={workouts} />
            </div>
        </div>
    );
}
