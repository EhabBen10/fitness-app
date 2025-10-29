import { User } from "@/app/lib/definitions";
import CreateUserForm from "@/app/ui/create_form";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('token');

    let userId = null;
    if (userToken) {
        const TokenInfo = jwtDecode(userToken.value) as {
            PersonalTrainer?: User
        } | null;
        userId = (TokenInfo as any)?.PersonalTrainer?.id ?? (TokenInfo as any)?.UserId ?? null;
    }

    return (
        <main>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Manager/Create Trainer</h1>
                <CreateUserForm userId={userId} />
            </div>
        </main>

    );
}