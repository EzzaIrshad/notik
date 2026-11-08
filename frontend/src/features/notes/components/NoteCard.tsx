import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/features/notes/components/tiptap-ui-primitive/tooltip"
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
import type { Note } from "../types/notes.types";
import { BsPinAngle as Pin, BsPinAngleFill as FilledPin, BsTrash3Fill as Trash } from "react-icons/bs";
import { MdModeEdit as Pen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUpdateNote } from "../hooks/useUpdateNote";
import { useDeleteNote } from "../hooks/useDeleteNote";
import { toast } from "sonner";

const htmlToText = (html: string) => {
    const el = document.createElement("div");
    el.innerHTML = html;

    el.querySelectorAll("br").forEach((br) => {
        br.replaceWith("\n");
    });

    el.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6").forEach((node) => {
        node.after("\n")
    });

    return el.textContent
        ?.replace(/\n{2,}/g, "\n")
        .trim() || "";
};

interface ToneItem {
    bg: string;
    pinColor: string;
    chip: string;
    pillBg: string;
}

interface NoteCardProps {
    tone: ToneItem;
    noteData: Note;
}

export const NoteCard = ({
    tone,
    noteData
}: NoteCardProps) => {

    const navigate = useNavigate();
    const updateMutation = useUpdateNote(noteData._id);
    const deleteMutation = useDeleteNote();

    const handlePin = () => {
        updateMutation.mutate({
            isPinned: !noteData.isPinned
        })
    }

    const handleEdit = () => {
        navigate(`/notes/${noteData._id}/edit`);
    }

    const handleDelete = () => {
        deleteMutation.mutate(noteData._id, {
            onSuccess: () => toast.success("Note deleted"),
            onError: () => toast.error("Failed to delete note")
        });
    }
    return (
        <div
            className="group relative flex flex-col justify-between rounded-sm p-3 shadow-card"
            style={{ backgroundColor: tone.bg }}
        >
            <div>
                {/* note actions */}
                <div className="flex items-start justify-between">
                    {/* pin */}
                    <Tooltip delay={200}>
                        <TooltipTrigger
                            onClick={handlePin}
                            aria-label={noteData.isPinned ? "Unpin note" : "Pin note"}
                            data-slot="Pin-Note"
                            className="grid size-9 place-items-center rounded-[9px] bg-white dark:bg-white/90 cursor-pointer focus-within:shadow-focus"
                            style={{ boxShadow: "-2px 2px 2px rgba(0, 0, 0, 0.3), rgba(9, 30, 66, 0.25) 0px 1px 2px, inset -2px 2px 3px 0px rgba(255, 255, 255, 0.5), inset 2px -2px 3px rgba(0, 0, 0, 0.2)" }}
                        >
                            {
                                noteData.isPinned ?
                                    <FilledPin className={`size-3.5 sm:size-4 ${tone.pinColor}`} />
                                    :
                                    <Pin className={`size-3.5 sm:size-4 ${tone.pinColor}`} strokeWidth={0.5} />
                            }
                        </TooltipTrigger>
                        <TooltipContent>
                            Pin
                        </TooltipContent>
                    </Tooltip>

                    <div className="flex items-start gap-2">
                        {/* edit */}
                        <Tooltip delay={200}>
                            <TooltipTrigger
                                onClick={handleEdit}
                                aria-label="Edit note"
                                data-slot="Edit-Note"
                                className="grid size-9 place-items-center rounded-[9px] cursor-pointer"
                                style={{ background: tone.chip }}
                            >
                                <Pen className="size-5 text-white fill-white" />
                            </TooltipTrigger>
                            <TooltipContent>
                                Edit
                            </TooltipContent>
                        </Tooltip>

                        {/* delete */}

                        <AlertDialog>
                            <AlertDialogTrigger
                                render={<button
                                    type="button"
                                    aria-label="Delete note"
                                    data-slot="Delete-Note"
                                    className="grid size-9 place-items-center rounded-[9px] cursor-pointer"
                                    style={{ background: tone.chip }}
                                >
                                    <Trash className="size-4 text-white fill-white icon-shadow" />
                                </button>}
                            />
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm deletion?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This note will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="text-red-500! hover:bg-red-200!">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <h3 className="mt-4 line-clamp-2 font-nunito text-lg font-extrabold leading-tight tracking-tight text-foreground">
                        {noteData.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-foreground/70">
                        {htmlToText(noteData.content)}
                    </p>
                </div>
            </div>

            {/* Date Pill */}
            <span
                className={`text-xs font-semibold text-foreground/60 dark:text-foreground/80 mt-8 rounded-full py-1 px-2 w-fit ${tone.pillBg}`}
            >
                {new Date(noteData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })}
            </span>
        </div>
    );
};