import { Link, useOutletContext } from "react-router-dom";
import { useGetNotes } from "../hooks/useGetNotes";
import { Plus } from "lucide-react";
import NotesPanel from "../components/NotesPanel";
import type { DashboardTab } from "../layouts/DashboardLayout";
import { useState } from "react";

interface DashboardContext {
    search: string;
    tab: DashboardTab;
    setTab: (tab: DashboardTab) => void;
}

const DashboardPage = () => {
    const { search, tab, setTab } = useOutletContext<DashboardContext>();
    const [sort, setSort] = useState<"createdAt" | "updatedAt">("createdAt");

    const { data, isLoading } = useGetNotes({
        search: search || undefined,
        isPinned: tab === "pinned" ? true : undefined,
        sort,
    });

    return (
        <div className="min-h-screen bg-background">

            <NotesPanel
                notes={data?.data ?? []}
                isLoading={isLoading}
                tab={tab}
                setTab={setTab}
                search={search}
                sort={sort}
                setSort={setSort}
            />

            {/* Floating New Note button */}
            <Link
                to={`/notes/new`}
                aria-label="Create new note"
                className="fixed bottom-6 right-6 z-50 inline-flex items-center rounded-full p-4 text-sm font-semibold 
                    bg-accent border border-pink text-white icon-container-shadow transition hover:-translate-y-1 sm:bottom-8 sm:right-8"
            >
                <Plus className="h-5 w-5" strokeWidth={2.75} />
            </Link>
        </div >
    )
}

export default DashboardPage