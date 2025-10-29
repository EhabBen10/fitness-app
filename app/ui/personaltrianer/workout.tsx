import { WorkoutFormData } from "@/app/lib/definitions";
import { AddExerciseButton, ViewWorkout } from "./buttons";

interface WorkoutProps {
    workout: WorkoutFormData;
    visibilityExercise?: boolean;
    visibilitybutton?: boolean;
}

export default function Workout({
    workout,
    visibilityExercise = true,
    visibilitybutton = true
}: WorkoutProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Workout Details</h2>
            <p><strong>Title:</strong> {workout.name}</p>
            <p><strong>Description:</strong> {workout.description}</p>
            {visibilityExercise && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Exercises:</h3>
                    <div className="space-y-4">
                        {workout.exercises.map((exercise, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <p><strong>Name:</strong> {exercise.name}</p>
                                <p><strong>Sets:</strong> {exercise.sets}</p>
                                <p><strong>Reps:</strong> {exercise.repetitions}</p>
                                {exercise.time && <p><strong>Rest Time:</strong> {exercise.time} seconds</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 flex gap-4">
                <AddExerciseButton workoutId={workout.workoutProgramId} />
                {visibilitybutton && (
                    <ViewWorkout workoutId={workout.workoutProgramId} />
                )}
            </div>
        </div>
    );
}
