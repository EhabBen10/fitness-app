import { WorkoutFormData } from "@/app/lib/definitions";
import Workout from "./workout";

export default function WorkoutsList({ workouts }: { workouts: WorkoutFormData[] }) {
    if (!workouts || workouts.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8">
                No workout programs found.
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {workouts.map((workout, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                    <Workout workout={workout} visibilityExercise={false} visibilitybutton={true} />
                </div>
            ))}
        </div>
    );
}