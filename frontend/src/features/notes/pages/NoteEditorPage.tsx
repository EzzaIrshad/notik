import { useNavigate, useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";

import { Sparkles } from "lucide-react"
import { MdError } from "react-icons/md";

import {
    createNoteSchema,
    updateNoteSchema,
    type CreateNoteInput,
    type UpdateNoteInput
} from "../schemas/note.schema";
import { useGetNote } from "../hooks/useGetNote";
import { useCreateNote } from "../hooks/useCreateNote";
import { useUpdateNote } from "../hooks/useUpdateNote";
import EditorTopBar from "../components/EditorTopBar"
import TagInput from "../components/TagInput";
import TextEditor from "../components/TextEditor";

const NoteEditorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateNoteInput | UpdateNoteInput>({
        resolver: zodResolver(isEdit ? updateNoteSchema : createNoteSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
            isPinned: false
        }
    });

    const { data: note } = useGetNote(id ?? "", isEdit);

    const createMutation = useCreateNote();
    const updateMutation = useUpdateNote(id ?? "");

    useEffect(() => {
        if (note) {
            reset({
                title: note.data?.title ?? "",
                content: note.data?.content ?? "",
                tags: note.data?.tags ?? [],
                isPinned: note.data?.isPinned ?? false,
            })
        }
    }, [note, reset])

    const onSubmit = (data: CreateNoteInput | UpdateNoteInput) => {
        if (isEdit && id) {
            updateMutation.mutate(data as UpdateNoteInput, {
                onSuccess: () => {
                    toast.success("Note updated successfully");
                },
                onError: () => {
                    toast.error("Failed to update note. Please try again.");
                },
            })
            return
        }

        createMutation.mutate(data as CreateNoteInput, {
            onSuccess: () => {
                toast.success("Note created successfully");
                navigate("/dashboard");
            },
            onError: () => {
                toast.error("Failed to create note. Please try again.");
            },
        });
    }

    return (
        <main className="mx-auto w-full max-w-275 px-4 py-4 sm:px-6 lg:px-8">

            <EditorTopBar
                isEdit={isEdit}
                isSubmitting={updateMutation.isPending || createMutation.isPending}
            />

            {/* Editor Layout */}
            <section
                className="relative mt-4 2xl:mt-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-card">
                {/* Accent stripe */}
                <div className="h-1.5 w-full bg-primary/40" aria-hidden />

                <div className="px-6 py-6 2xl:px-8">

                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary/40 text-secondary-foreground px-3 py-1 text-xs font-semibold">
                            <Sparkles className="h-3 w-3" />
                            {isEdit ? "Editing note" : "New note"}
                        </span>
                    </div>

                    <form
                        id="note-editor-form"
                        onSubmit={handleSubmit(onSubmit)}>

                        <div className="mt-4">
                            <label htmlFor="note-title" className="sr-only">Note title</label>
                            <input
                                id="note-title"
                                placeholder="Untitled note"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                                {...register("title")}
                                className={`w-full bg-transparent font-nunito text-3xl sm:text-4xl font-extrabold text-foreground placeholder:text-foreground/25 focus:outline-none  border-b-2 border-transparent focus:border-primary pb-2`}
                            />
                            {errors.title?.message && (
                                <ErrorMessage id="title-error" error={errors.title?.message} />
                            )}
                        </div>

                        <Controller
                            name="content"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <TextEditor
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <ErrorMessage id="content-error" error={fieldState.error.message} />
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="tags"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <TagInput
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <ErrorMessage id="tags-error" error={fieldState.error.message} />
                                    )}
                                </div>
                            )
                            }
                        />
                    </form>
                </div>
            </section>
        </main>
    )
}

function ErrorMessage({ id, error }: Readonly<{ id: string; error: string | undefined }>) {
    return (
        <div className="flex items-center gap-2 mt-1.5 text-destructive">
            <MdError size={16} />
            <p id={id} className="text-xs">
                {error}
            </p>
        </div>
    )
}

export default NoteEditorPage