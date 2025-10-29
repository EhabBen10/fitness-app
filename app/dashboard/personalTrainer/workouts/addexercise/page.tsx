import { fetchWorkoutById } from "@/app/lib/data";
import CreateExerciseForm from "@/app/ui/personaltrianer/add_exs_form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Add Exercises',
};

export default async function AddExercisesPage(props: {
    searchParams?: Promise<{
        workoutId?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const workoutId = searchParams?.workoutId ? parseInt(searchParams.workoutId) : null;
    if (!workoutId) {
        return (
            <main>
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4">Error</h1>
                    <p className="text-red-600">No workout selected. Please select a workout first.</p>
                </div>
            </main>
        );
    }
    const workout = await fetchWorkoutById(workoutId);
    if (!workout) {
        return (
            <main>
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4">Error</h1>
                    <p className="text-red-600">No workout selected. Please select a workout first.</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Add Exercises to Workout</h1>
                <CreateExerciseForm workout={workout} />
            </div>
        </main>
    );
}
