'use client';

import Link from 'next/link';
import {
    PlusIcon,
    TrashIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState, useState } from 'react';
import { createWorkout } from '@/app/lib/data';

type FormState = {
    message: string | null;
    errors: Record<string, string[]>;
};

interface Exercise {
    name: string;
    description: string;
    sets: number;
    repetitions: number;
    time: string;
}

interface CreateWorkoutFormProps {
    clientId: number;
}

export default function CreateWorkoutForm({ clientId }: CreateWorkoutFormProps) {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentExercise, setCurrentExercise] = useState<Exercise>({
        name: '',
        description: '',
        sets: 0,
        repetitions: 0,
        time: '',
    });

    const initialState: FormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createWorkout, initialState);

    const handleExerciseChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCurrentExercise((prev) => ({
            ...prev,
            [name]:
                name === 'sets' || name === 'repetitions'
                    ? parseInt(value) || 0
                    : value,
        }));
    };

    const addExercise = () => {
        if (currentExercise.name.trim()) {
            setExercises((prev) => [...prev, currentExercise]);
            setCurrentExercise({
                name: '',
                description: '',
                sets: 0,
                repetitions: 0,
                time: '',
            });
        }
    };

    const removeExercise = (index: number) => {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Workout Details
                </h2>

                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Workout Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g., Upper Body Strength"
                        className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="name-error"
                        required
                    />
                    <div
                        id="name-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p
                                    className="mt-2 text-sm text-red-500"
                                    key={error}
                                >
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe the workout..."
                        rows={3}
                        className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <div
                        id="description-error"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {state.errors?.description &&
                            state.errors.description.map(
                                (error: string) => (
                                    <p
                                        className="mt-2 text-sm text-red-500"
                                        key={error}
                                    >
                                        {error}
                                    </p>
                                )
                            )}
                    </div>
                </div>

                <input type="hidden" name="clientId" value={clientId} />
            </div>

            <div className="mt-6 rounded-md bg-gray-50 p-4 md:p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Add Exercises
                </h2>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="exerciseName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Exercise Name
                        </label>
                        <input
                            type="text"
                            id="exerciseName"
                            name="exerciseName"
                            value={currentExercise.name}
                            onChange={(e) =>
                                setCurrentExercise((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="e.g., Bench Press"
                            className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="exerciseDescription"
                            className="mb-2 block text-sm font-medium"
                        >
                            Exercise Description
                        </label>
                        <textarea
                            id="exerciseDescription"
                            name="exerciseDescription"
                            value={currentExercise.description}
                            onChange={(e) =>
                                setCurrentExercise((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Describe the exercise..."
                            rows={2}
                            className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="sets"
                                className="mb-2 block text-sm font-medium"
                            >
                                Sets
                            </label>
                            <input
                                type="number"
                                id="sets"
                                name="sets"
                                value={currentExercise.sets}
                                onChange={handleExerciseChange}
                                min="0"
                                className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="repetitions"
                                className="mb-2 block text-sm font-medium"
                            >
                                Reps
                            </label>
                            <input
                                type="number"
                                id="repetitions"
                                name="repetitions"
                                value={currentExercise.repetitions}
                                onChange={handleExerciseChange}
                                min="0"
                                className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="time"
                                className="mb-2 block text-sm font-medium"
                            >
                                Time
                            </label>
                            <input
                                type="text"
                                id="time"
                                name="time"
                                value={currentExercise.time}
                                onChange={(e) =>
                                    setCurrentExercise((prev) => ({
                                        ...prev,
                                        time: e.target.value,
                                    }))
                                }
                                placeholder="e.g., 60s"
                                className="block w-full rounded-md border border-gray-200 px-4 py-2 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={addExercise}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Exercise
                        </button>
                    </div>
                </div>
            </div>

            {exercises.length > 0 && (
                <div className="mt-6 rounded-md bg-gray-50 p-4 md:p-6">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Exercises ({exercises.length})
                    </h2>

                    <div className="space-y-3">
                        {exercises.map((exercise: Exercise, index: number) => (
                            <div
                                key={index}
                                className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                        {exercise.name}
                                    </h3>
                                    {exercise.description && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {exercise.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex gap-6 text-sm text-gray-600">
                                        <span>Sets: {exercise.sets}</span>
                                        <span>Reps: {exercise.repetitions}</span>
                                        {exercise.time && (
                                            <span>Time: {exercise.time}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeExercise(index)}
                                    className="ml-4 text-red-600 transition-colors hover:text-red-800"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>


                    <input
                        type="hidden"
                        name="exercises"
                        value={JSON.stringify(exercises)}
                    />
                </div>
            )}

            {state.errors?.exercises && (
                <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 p-3">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <div>
                        {state.errors.exercises.map((error: string) => (
                            <p className="text-sm text-red-600" key={error}>
                                {error}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {state.message && (
                <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 p-3">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-600">{state.message}</p>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/personalTrainer/workouts"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Workout</Button>
            </div>
        </form>
    );
}
