import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "../api/notes.api"


/**
 * Create a new note and invalidate the notes cache
 * @returns 
 */
export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notes"],
            });
        },
    });
}