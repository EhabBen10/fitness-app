import { WorkoutFormData } from "@/app/lib/definitions";
import { AddExerciseButton } from "./buttons";

export default function Workout(workout: { workout: WorkoutFormData }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Workout Details</h2>
            <p><strong>Title:</strong> {workout.workout.name}</p>
            <p><strong>Description:</strong> {workout.workout.description}</p>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Exercises:</h3>
                <div className="space-y-4">
                    {workout.workout.exercises.map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <p><strong>Name:</strong> {exercise.name}</p>
                            <p><strong>Sets:</strong> {exercise.sets}</p>
                            <p><strong>Reps:</strong> {exercise.repetitions}</p>
                            {exercise.time && <p><strong>Rest Time:</strong> {exercise.time} seconds</p>}
                        </div>
                    ))}

                </div>
                <AddExerciseButton />
            </div>
        </div>
    );
}
