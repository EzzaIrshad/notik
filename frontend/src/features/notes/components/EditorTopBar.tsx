import { ArrowLeft, Save, X } from "lucide-react"
import { Link } from "react-router-dom"

interface Props {
    isEdit: boolean;
    isSubmitting: boolean;
}

const EditorTopBar = ({ isEdit, isSubmitting }: Props) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <Link
                    to={"/dashboard"}
                    aria-label="Back to dashboard"
                    className="grid size-9 place-items-center rounded-full border border-border/60 icon-container-shadow"
                    style={{ background: "linear-gradient(135deg, var(--lavender), oklch(0.72 0.14 300))" }}
                >
                    <ArrowLeft className="size-3.5 sm:size-4 text-white icon-shadow" />
                </Link>
                <nav aria-label="Breadcrumb" className="hidden text-sm text-muted-foreground sm:block">
                    <ol className="flex items-center gap-1.5">
                        <li><Link to="/dashboard" className="hover:text-foreground">All notes</Link></li>
                        <li aria-hidden>/</li>
                        <li className="font-semibold text-foreground">{isEdit ? "Edit note" : "New note"}</li>
                    </ol>
                </nav>
            </div>
            <div className="flex items-center gap-2">
                <Link
                    to="/dashboard"
                    aria-label="Cancel"
                    className="group inline-flex shrink-0 items-center justify-center gap-1 sm:gap-2 rounded-full overflow-hidden transition-transform px-2.5 sm:px-4 py-1.75 
                            md:py-2.5 text-xs sm:text-sm font-semibold text-foreground cursor-pointer
                            bg-gradient-soft dark:bg-muted input-shadow dark:bg-linear-0 dark:border dark:border-gray-500"
                >
                    <X className="h-4 w-4" />
                    Cancel
                </Link>
                <button
                    type="submit"
                    form="note-editor-form"
                    aria-label={isEdit ? "Save changes" : "Create note"}
                    disabled={isSubmitting}
                    className="group inline-flex shrink-0 items-center justify-center gap-1 cursor-pointer sm:gap-2 rounded-full bg-accent border border-pink px-2.5 sm:px-5 py-1.75 md:py-2.5 text-xs sm:text-sm font-semibold text-card input-shadow">
                    <Save className="size-4" strokeWidth={2.5} />
                    {
                        isEdit ?
                            ( isSubmitting ? "Saving..." : "Save changes")
                            : (isSubmitting ? "Creating..." : "Create note")
                    }
                </button>
            </div>
        </div>
    )
}

export default EditorTopBar