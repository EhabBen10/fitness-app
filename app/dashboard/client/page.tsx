import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { User, WorkoutFormData } from "@/app/lib/definitions";
import { fetchWorkouts } from "@/app/lib/data";

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

    // ✅ Hent workoutprogrammer
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

                {/* ✅ Workout Program List */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Your Workout Programs</h2>
                    {workouts.length === 0 ? (
                        <p className="text-gray-500">No workout programs found.</p>
                    ) : (
                        <div className="space-y-4">
                            {workouts.map((program) => (
                                <div
                                    key={program.workoutProgramId}
                                    className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-800"
                                >
                                    <h3 className="text-lg font-semibold mb-2">
                                        {program.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {program.description}
                                    </p>

                                    <div className="space-y-2">
                                        {program.exercises.map((exercise, idx) => (
                                            <div
                                                key={idx}
                                                className="border-l-4 border-blue-500 pl-3"
                                            >
                                                <p className="font-medium">{exercise.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {exercise.description}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Sets: {exercise.sets} • Reps: {exercise.repetitions} • Time:{" "}
                                                    {exercise.time || "-"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
