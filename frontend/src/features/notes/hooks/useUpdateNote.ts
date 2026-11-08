import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateNote } from "../api/notes.api"
import type { UpdateNoteInput } from "../schemas/note.schema";

/**
 * Update the existing note by its ID and invalidate the notes cache as well as the note itself.
 * @param id Note Id 
 */
export const useUpdateNote = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateNoteInput) => updateNote(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes"],
            });

            queryClient.invalidateQueries({
                queryKey: ["note", id],
            });
        },
    });
}