import { Plus } from "lucide-react";
import empty from "@/assets/empty-state.png"
import { Link } from "react-router-dom";

export function EmptyState() {
    return (
        <div className="flex font-nunito w-full h-full flex-col items-center justify-center text-center">
            <div className="relative mb-6 h-32">
                <img
                    alt=""
                    src={empty}
                    className="size-full"
                />
            </div>
            <h3 className=" text-2xl font-extrabold tracking-tight text-foreground">
                Your notebook is waiting.
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Create your first note and start organizing your ideas beautifully.
            </p>
            <Link to="/notes/new" className="group inline-flex shrink-0 mt-6 items-center justify-center gap-1 sm:gap-2 rounded-full bg-accent input-shadow 
            border border-pink px-2.5 sm:px-5 py-1.75 md:py-3 text-xs sm:text-sm font-semibold text-card transition hover:-translate-y-0.5">
                <Plus className="size-4" strokeWidth={2.5} />
                Create note
            </Link>
        </div>
    );
}

export function EmptySearchState({ search }: { readonly search: string }) {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <h3 className="font-nunito text-xl font-bold">
                No notes found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
                No notes match "{search}"
            </p>
        </div>
    )
}

export function EmptyPinnedState() {
    return (
        <div className="flex font-nunito w-full h-full flex-col items-center justify-center text-center">
            <h3 className=" text-xl font-bold tracking-tight text-foreground">
                You haven't pinned any notes yet.
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Pin your important notes to keep them easily accessible and organized.
            </p>
        </div>
    )
}