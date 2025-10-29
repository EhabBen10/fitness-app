import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export function CreateClient() {
    return (
        <Link
            href="/dashboard/personalTrainer/clients/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Create Client</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
export function AddExerciseButton({ workoutId }: { workoutId: number }) {
    return (
        <Link
            href={`/dashboard/personalTrainer/workouts/addexercise?workoutId=${workoutId}`}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <PlusIcon className="h-5 md:ml-4" />
            <span className="hidden md:block">Add Exercise</span>{' '}
        </Link>
    );
}
export function CreateWorkout({ userId }: { userId: number }) {
    return (
        <Link
            href={`/dashboard/personalTrainer/workouts/create?userId=${userId}`}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Create Workout program</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function ViewWorkout({ workoutId }: { workoutId: number }) {
    return (
        <Link
            href={`/dashboard/personalTrainer/workouts/workout?workoutId=${workoutId}`}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"

        >
            <span >View Workout</span>{' '}
        </Link>
    );
}