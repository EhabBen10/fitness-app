export interface User {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    personalTrainerId: number | null;
    accountType: "Manager" | "PersonalTrainer" | "Client";
}

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Exercise {
    name: string;
    description: string;
    sets: number;
    repetitions: number;
    time: string;
}

export interface WorkoutFormData {
    name: string;
    description: string;
    exercises: Exercise[];
    clientId: number;
}