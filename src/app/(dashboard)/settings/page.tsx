import { getUserProfile } from "@/app/actions/database";
import SettingsForm from "./SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and profile.</p>
            </div>

            <SettingsForm initialProfile={profile} />
        </div>
    );
}
