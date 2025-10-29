'use client';
import { useState } from 'react';
import { addExerciseToServer } from '@/app/lib/data';
import { Exercise, WorkoutFormData } from '@/app/lib/definitions';

interface CreateExerciseFormProps {
    workout: WorkoutFormData;
}

export default function CreateExerciseForm({ workout }: CreateExerciseFormProps) {
    const [exercises, setExercises] = useState<Exercise[]>(
        workout.exercises || []
    );
    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const newExercise: Exercise = {
                        name: (formData.get('name') as string) || '',
                        description: (formData.get('description') as string) || '',
                        sets: Number(formData.get('sets')),
                        repetitions: Number(formData.get('repetitions')),
                        time: (formData.get('time') as string) || '',
                    };
                    await addExerciseToServer(newExercise, formData, workout.workoutProgramId);
                    setExercises((prev) => [...prev, newExercise]);
                    form.reset();
                }}
            >
                <div className="mt-6 rounded-md bg-gray-50 p-4 md:p-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Add Exercises
                    </h2>
                    <div className="space-y-4">
                        <input type="text" name="name" placeholder="Exercise Name" required className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500" />
                        <textarea name="description" placeholder="Description" className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500" />
                        <input type="number" name="sets" placeholder="Sets" required className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500" />
                        <input type="number" name="repetitions" placeholder="Repetitions" required className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500" />
                        <input type="text" name="time" placeholder="Time it should last in sec" className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500" />
                        <button type="submit" className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Add Exercise</button>
                    </div>
                </div>

            </form>
        </div>
    );
}

