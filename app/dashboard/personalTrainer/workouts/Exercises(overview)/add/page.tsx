import { fetchWorkouts } from "@/app/lib/data";
import WorkoutsList from "@/app/ui/personaltrianer/WorkoutsList";
import { Metadata } from "next";

export default async function Workouts(
) {
    const workouts = await fetchWorkouts();

    return (
        <main>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Workouts</h1>
                {/* <AddExercisesForm workoutId={0} currentExercises={[]} /> */}
            </div>
        </main>
    );
}