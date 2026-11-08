import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { Calendar, FileText, LogOut, Mail, Sparkles } from "lucide-react";
import { useGetNotes } from "../hooks/useGetNotes";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { useState } from "react";

const UserProfile = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const navigate = useNavigate();
    const { data } = useGetUser();
    const user = data?.data;

    const { data: notes } = useGetNotes();
    const totalNotes = notes?.data?.length;
    const getInitials = (name: string | undefined) => {
        return name?.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
    }

    const now = new Date();

    const notesThisMonth = notes?.data?.filter((note) => {
        const date = new Date(note.createdAt);
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        )
    }).length;

    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            }
        })
    };

    return (
        <>

            <h2 className="font-nunito text-xl font-black text-foreground">
                My Profile
            </h2>

            <div className="flex flex-col items-center text-center">
                <div
                    className="relative rounded-full p-1.5 bg-lavender/80"
                    style={{
                        boxShadow: "0 0 0 4px oklch(0.88 0.08 300 / 0.25)",
                    }}
                >
                    <div className="size-15 flex items-center justify-center">

                        <span className="text-foreground text-3xl">
                            {getInitials(user?.fullName)}
                        </span>
                    </div>
                </div>
                <h3 className="mt-3 font-nunito text-lg font-extrabold tracking-tight text-foreground">
                    {user?.fullName}
                </h3>
            </div>

            {/* Account info card */}
            <div className="rounded-2xl border border-border bg-background/60 py-2 px-4 dark:bg-background/40">
                <div className="flex items-center gap-3 py-1">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sky">
                        <Mail className="h-4 w-4 text-foreground/80" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">Email</p>
                        <p className="truncate text-xs font-semibold text-foreground">{user?.email}</p>
                    </div>
                </div>
                <div className="my-2 h-px bg-border/50" />
                <div className="flex items-center gap-3 py-1">
                    <span
                        className="grid h-8 w-8 place-items-center rounded-full bg-peach"
                    >
                        <Calendar className="h-4 w-4 text-foreground/80" strokeWidth={2.25} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">Member since</p>
                        <p className="truncate text-xs font-semibold text-foreground">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                            }) : "Unknown"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Activity stats */}
            <div className="font-nunito">
                <div className="flex items-center gap-2">
                    <span
                        className="grid h-6 w-6 place-items-center rounded-full bg-mint"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-foreground/80" strokeWidth={2.5} />
                    </span>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        Your Notik
                    </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-sm p-3 bg-lavender">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-foreground/80" strokeWidth={2.25} />
                            <span className="text-2xl font-extrabold text-foreground">
                                {totalNotes}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-foreground/70">Total Notes</p>
                    </div>
                    <div className="rounded-sm p-3 bg-peach">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-foreground/80" strokeWidth={2.25} />
                            <span className="text-2xl font-extrabold text-foreground">
                                {notesThisMonth}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-foreground/70">Created this month</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full mt-4 flex flex-col-reverse gap-3 justify-between sm:flex-row ">
                <button
                    type="button"
                    aria-label="Cancel profile"
                    onClick={() => onOpenChange(false)}
                    className="w-full px-4 py-2 rounded-[5px] text-foreground bg-background/60 border border-gray-300 hover:bg-secondary sm:w-auto cursor-pointer"
                >
                    Cancel
                </button>

                <AlertDialog
                    open={logoutOpen}
                    onOpenChange={setLogoutOpen}>
                    <AlertDialogTrigger
                        render={<button
                            type="button"
                            className="w-full gap-2 flex justify-center py-2 px-4 rounded-[5px] border border-[oklch(0.9_0.1_25)] bg-[oklch(0.92_0.06_25)] text-foreground hover:bg-[oklch(0.92_0.12_25)] dark:bg-[oklch(0.3_0.06_25)] dark:text-foreground dark:hover:bg-[oklch(0.35_0.07_25)] sm:w-auto cursor-pointer transition-colors"
                        >
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-[oklch(0.9_0.2_25)]">
                                <LogOut className="h-3.5 w-3.5 text-foreground/90" strokeWidth={2.5} />
                            </span> Log out
                        </button>}
                    />
                    <div className={`abolute inset-0 rounded-xl bg-black/5 backdrop-blur-[2px] ${logoutOpen ? "fixed h-screen" : "hidden h-0"}`} />
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Log out of Notik?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You'll need to sign in again to access your notes.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-[#EAEAEB]!">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout} className="bg-red-400! text-white! cursor-pointer">
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog >
            </div >
        </>
    )
}

export default UserProfile