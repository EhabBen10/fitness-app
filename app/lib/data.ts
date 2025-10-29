'use server';
import { cookies } from 'next/headers';
import { Exercise, User } from "./definitions";
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';


const FormSchema = z.object({
    firstName: z.string({ message: 'Please enter a first name.' }).min(1, 'First name is required'),
    lastName: z.string({ message: 'Please enter a last name.' }).min(1, 'Last name is required'),
    email: z.string({ message: 'Please enter a valid email.' }).email('Invalid email address'),
    password: z.string({ message: 'Please enter a password.' }).min(2, 'Password must be at least 6 characters long'),
    accountType: z.enum(['Manager', 'PersonalTrainer', 'Client'], {
        message: 'Please select a valid account type.',
    }),
    personalTrainerId: z.string().optional(),
});

// Workout schema and types
const WorkoutExerciseSchema = z.object({
    name: z.string({ message: 'Exercise name is required.' }).min(1, 'Exercise name is required'),
    description: z.string().optional(),
    sets: z.number().min(0, 'Sets must be 0 or greater'),
    repetitions: z.number().min(0, 'Repetitions must be 0 or greater'),
    time: z.string().optional(),
});

const CreateWorkoutSchema = z.object({
    name: z.string({ message: 'Workout name is required.' }).min(1, 'Workout name is required'),
    description: z.string().optional(),
    exercises: z.array(WorkoutExerciseSchema).min(1, 'At least one exercise is required'),
    clientId: z.number().int('Client ID must be a valid number'),
});
async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
}

async function getUserRoleFromToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return null;

        const decoded = jwtDecode(token) as { Role?: string };
        return decoded?.Role || null;
    } catch (error) {
        return null;
    }
}

function getRedirectPath(role: string | null): string {
    switch (role) {
        case 'Manager':
            return '/dashboard/manager/trainer';
        case 'PersonalTrainer':
            return '/dashboard/personalTrainer/clients';
        default:
            return '/dashboard';
    }
}


export async function fetchUsers(query: string, currentPage: number) {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/Users`, {
        method: 'GET',
        headers,
    });

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    const users = await res.json();

    if (query === 'PersonalTrainer') {
        const trainers = users.filter((user: User) =>
            user.accountType === 'PersonalTrainer'
        );
        return trainers as User[];
    } else if (query === 'Client') {
        const clients = users.filter((user: User) =>
            user.accountType === 'Client'
        );
        return clients as User[];
    }

    return users as User[];
}

const CreateUserSchema = FormSchema;
type CreateUserState = {
    message: string | null;
    errors: Record<string, string[]>;
};
export async function createUser(prevState: CreateUserState,
    formData: FormData
): Promise<CreateUserState> {
    const validatedFields = CreateUserSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        accountType: formData.get('accountType'),
        personalTrainerId: formData.get('personalTrainerId'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Missing or invalid fields.',
            errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    try {
        const headers = await getAuthHeaders();

        // Build request body
        const requestBody: Record<string, any> = {
            firstName: validatedFields.data.firstName,
            lastName: validatedFields.data.lastName,
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            accountType: validatedFields.data.accountType,
        };

        // Include personalTrainerId if provided
        if (validatedFields.data.personalTrainerId) {
            requestBody.personalTrainerId = validatedFields.data.personalTrainerId;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/Users`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        // 201 Created or 200 OK are both success
        if (res.status !== 201 && res.status !== 200) {
            // Log the actual response for debugging
            const errorData = await res.text();
            console.error(`API Error - Status: ${res.status}, Response:`, errorData);

            return {
                message: `Failed to create user. (Status: ${res.status})`,
                errors: {},
            };
        }
        const userRole = await getUserRoleFromToken();
        const redirectPath = getRedirectPath(userRole);

        revalidatePath(redirectPath);
        redirect(redirectPath);
    } catch (error) {
        // Re-throw Next.js redirect errors
        if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        return {
            message: 'An error occurred. Please try again.',
            errors: {},
        };
    }

}

export async function fetchClient() {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/Users/Clients`, {
        method: 'GET',
        headers,
    });

    if (!res.ok) {
        throw new Error('Failed to fetch client');
    }
    const clients = await res.json();

    return clients as User[];
}



type CreateWorkoutState = {
    message: string | null;
    errors: Record<string, string[]>;
};
type CreateExerciseState = {
    message: string | null;
    errors: Record<string, string[]>;
};

export async function createWorkout(
    prevState: CreateWorkoutState,
    formData: FormData
): Promise<CreateWorkoutState> {
    try {
        const name = formData.get('name');
        const description = formData.get('description');
        const clientId = formData.get('clientId');
        const exercisesJson = formData.get('exercises');

        // Parse exercises JSON
        let exercises = [];
        if (exercisesJson) {
            exercises = JSON.parse(exercisesJson as string);
        }

        const validatedFields = CreateWorkoutSchema.safeParse({
            name,
            description,
            exercises,
            clientId: parseInt(clientId as string),
        });

        if (!validatedFields.success) {
            return {
                message: 'Missing or invalid fields.',
                errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        const headers = await getAuthHeaders();

        const requestBody = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            exercises: validatedFields.data.exercises,
            clientId: validatedFields.data.clientId,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/WorkoutPrograms`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (res.status !== 201 && res.status !== 200) {
            const errorData = await res.text();
            console.error(`API Error - Status: ${res.status}, Response:`, errorData);

            return {
                message: `Failed to create workout. (Status: ${res.status})`,
                errors: {},
            };
        }

        revalidatePath('/dashboard/personalTrainer/workouts');
        redirect('/dashboard/personalTrainer/workouts');
    } catch (error) {
        // Re-throw Next.js redirect errors
        if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        return {
            message: 'An error occurred. Please try again.',
            errors: {},
        };
    }
}

export async function addExerciseToServer(
    _prevState: Exercise,
    formData: FormData,
    workoutId: number
): Promise<CreateExerciseState> {
    try {
        const name = formData.get('name');
        const description = formData.get('description');
        const sets = formData.get('sets');
        const repetitions = formData.get('repetitions');
        const time = formData.get('time');

        const validatedFields = WorkoutExerciseSchema.safeParse({
            name,
            description,
            sets: Number(sets),
            repetitions: Number(repetitions),
            time,
        });

        if (!validatedFields.success) {
            return {
                message: 'Missing or invalid fields.',
                errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        const headers = await getAuthHeaders();
        const requestBody = {
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            sets: validatedFields.data.sets,
            repetitions: validatedFields.data.repetitions,
            time: validatedFields.data.time,
        };
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/Exercises/Program/${workoutId}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });
        if (res.status !== 201 && res.status !== 200) {
            const errorData = await res.text();
            console.error(`API Error - Status: ${res.status}, Response:`, errorData);
            return {
                message: 'Failed to add exercise. Please try again.',
                errors: {},
            };
        }
        revalidatePath('/dashboard/personalTrainer/workouts/workout?workoutId=' + workoutId);
        redirect('/dashboard/personalTrainer/workouts/workout?workoutId=' + workoutId);
    } catch (error) {
        // Re-throw Next.js redirect errors so they propagate correctly
        if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        return {
            message: 'An error occurred. Please try again.',
            errors: {},
        };
    }
}

export async function fetchWorkouts() {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/WorkoutPrograms`, {
        method: 'GET',
        headers,
    });

    if (!res.ok) {
        throw new Error('Failed to fetch workouts');
    }

    const workouts = await res.json();
    return workouts;
}

export async function fetchWorkoutById(workoutId: number) {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/WorkoutPrograms/${workoutId}`, {
        method: 'GET',
        headers,
    });
    if (!res.ok) {
        throw new Error('Failed to fetch workout');
    }

    const workout = await res.json();
    return workout;
}