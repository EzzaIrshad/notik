import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "../api/notes.api"


/**
 * Delete a note by its Id and invalidate the notes cache and that individual note.
 */
export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: ["notes"],
            });

            queryClient.removeQueries({
                queryKey: ["note", id],
            });
        },
    });
}