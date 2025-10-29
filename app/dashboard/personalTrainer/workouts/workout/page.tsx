import { fetchWorkoutById } from "@/app/lib/data";
import Workout from "@/app/ui/personaltrianer/workout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Workout Details',
};

export default async function WorkoutPage(props: {
    params?: Promise<{ id?: string }>;
    searchParams?: Promise<{ workoutId?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const workoutId = params?.id ?? searchParams?.workoutId;

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

    const workout = await fetchWorkoutById(parseInt(workoutId));

    return (
        <main>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Workout Details</h1>
                <Workout workout={workout} visibilityExercise={true} visibilitybutton={false} />
            </div>
        </main>
    );
}