"use client";

import { useState, useEffect } from "react";
import { WorkoutFormData } from "@/app/lib/definitions";

interface Props {
    workouts: WorkoutFormData[];
}

export default function ClientWorkoutList({ workouts }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        if (workouts.length === 1) {
            setExpandedId(workouts[0].workoutProgramId);
        }
    }, [workouts]);

    const toggleExpand = (id: number) => {
        if (workouts.length === 1) return;

        setExpandedId(expandedId === id ? null : id);
    };

    if (workouts.length === 0) {
        return <p className="text-gray-500">No workout programs found.</p>;
    }

    const isSingle = workouts.length === 1;

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
                Your {workouts.length}{" "}
                {isSingle ? "Workout Program" : "Workout Programs"}
            </h2>
            <div className="space-y-4">
                {workouts.map((program) => {
                    const isExpanded = expandedId === program.workoutProgramId;

                    return (
                        <div
                            key={program.workoutProgramId}
                            className={`border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-800 transition ${
                                workouts.length > 1 ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700" : ""
                            }`}
                            onClick={() => toggleExpand(program.workoutProgramId)}
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{program.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {program.description}
                                </p>
                            </div>

                            {isExpanded && (
                                <div className="mt-4 border-t border-gray-300 dark:border-slate-600 pt-3">
                                    <h4 className="text-md font-medium mb-2">Exercises:</h4>
                                    <div className="space-y-2">
                                        {program.exercises.map((exercise, idx) => (
                                            <div
                                                key={idx}
                                                className="border-l-4 border-blue-500 pl-3"
                                            >
                                                <p className="font-medium">{exercise.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {exercise.description}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Sets: {exercise.sets} • Reps:{" "}
                                                    {exercise.repetitions} • Time:{" "}
                                                    {exercise.time || "-"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
