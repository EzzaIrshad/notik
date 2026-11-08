import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { CardSkeleton } from "@/shared/components/ui/skeleton"
import { Pin, Plus, StickyNote } from "lucide-react"
import { Link } from "react-router-dom"
import { EmptyPinnedState, EmptySearchState, EmptyState } from "./EmptyState"
import { NoteCard } from "./NoteCard"
import type { Note } from "../types/notes.types"
import { cardTones } from "../constant/cardTones"
import type { DashboardTab } from "../layouts/DashboardLayout"
import SortMenu from "./SortMenu"

const headerTabs = [
    {
        name: 'All Notes',
        value: 'all-notes',
        icon: <StickyNote className="size-3 md:size-3.5" />,
    },
    {
        name: 'Pinned',
        value: 'pinned',
        icon: <Pin className="size-3 md:size-3.5" />,
    },
]

interface Props {
    notes: Note[];
    isLoading: boolean;
    tab: DashboardTab;
    setTab: (tab: DashboardTab) => void;
    search: string;
    sort: "createdAt" | "updatedAt";
    setSort: (sort: "createdAt" | "updatedAt") => void;
}

const NotesPanel = ({ notes, isLoading, tab, setTab, search, sort, setSort }: Props) => {

    const handleTabChange = (value: string) => {
        if (value === "all-notes" || value === "pinned") {
            setTab(value);
        }
    };

    const renderEmptyState = () => {
        if (search) {
            return <EmptySearchState search={search} />;
        }

        if (tab === "pinned") {
            return <EmptyPinnedState />;
        }

        return <EmptyState />;
    };

    return (
        <div className="mx-auto flex w-full max-w-330 h-full gap-2 px-4 pb-3 sm:px-6 lg:px-8">
            <div className="py-4 md:py-6 w-full">
                <Tabs value={tab} onValueChange={handleTabChange} className='gap-6 2xl:gap-10 w-full h-full'>
                    <TabsList className="bg-transparent h-6 md:h-10! p-0 flex items-start justify-between w-full">
                        <div className="gap-3 md:gap-5 flex items-start justify-between">
                            {headerTabs.map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className='gap-1 max-sm:text-xs sm:gap-2 px-2 py-1.75 sm:p-2.5 sm:px-3 rounded-full bg-lavender/60 dark:bg-lavender/80 data-active:bg-primary 
                                        dark:data-active:bg-primary data-active:text-card dark:data-active:text-card data-active:input-shadow! data-active:border-0.5 
                                      data-active:hover:text-white data-active:[&>span]:bg-card data-active:[&>span]:text-foreground cursor-pointer'
                                >
                                    {tab.icon}
                                    {tab.name}
                                    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-muted text-foreground/60" >
                                        {tab.value === 'all-notes' ? notes.length : notes.filter(note => note.isPinned).length}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="max-md:hidden">
                                <SortMenu
                                    sort={sort}
                                    setSort={setSort}
                                />
                            </div>
                            <Link
                                to="/notes/new"
                                className="group inline-flex shrink-0 items-center justify-center gap-1 sm:gap-2 rounded-full bg-accent border border-pink px-2.5 sm:px-5 py-1.75 md:py-3 text-xs sm:text-sm font-semibold text-card input-shadow transition hover:-translate-y-0.5">
                                <Plus className="size-4" strokeWidth={2.5} />
                                <span className="max-sm:hidden">Create new note</span>
                                <span className="sm:hidden">Create</span>
                            </Link>
                        </div>
                    </TabsList>
                    <div className="md:hidden">
                        <SortMenu
                            sort={sort}
                            setSort={setSort}
                        />
                    </div>
                    {
                        headerTabs.map(tab => (
                            <TabsContent key={tab.value} value={tab.value} className="min-h-[50vh]">
                                <div>
                                    <h2 className="font-nunito text-2xl font-black tracking-tight text-foreground">
                                        My Notes
                                    </h2>
                                    {notes.length !== 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            {notes.length} {notes.length === 1 ? "note" : "notes"}
                                        </p>
                                    )}
                                </div>
                                {
                                    isLoading &&
                                    <div className="flex gap-6">
                                        <CardSkeleton />
                                        <CardSkeleton />
                                    </div>
                                }
                                {!isLoading && (
                                    notes.length ? (
                                        <div className="mt-6 grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 auto-rows-[minmax(190px,auto)]">
                                            {
                                                notes.map((note, index) => (
                                                    <NoteCard
                                                        key={note._id}
                                                        tone={cardTones[index % cardTones.length]}
                                                        noteData={note}
                                                    />
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        renderEmptyState()
                                    )
                                )}
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </div>
        </div>
    )
}

export default NotesPanel