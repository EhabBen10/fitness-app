import CreateWorkoutForm from "@/app/ui/personaltrianer/create_workout_form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create Workout',
};

export default async function CreateWorkout(props: {
    searchParams?: Promise<{
        userId?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const userId = searchParams?.userId ? parseInt(searchParams.userId) : null;

    if (!userId) {
        return (
            <main>
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4">Error</h1>
                    <p className="text-red-600">No client selected. Please select a client first.</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Create Workout</h1>
                <CreateWorkoutForm clientId={userId} />
            </div>
        </main>
    );
}