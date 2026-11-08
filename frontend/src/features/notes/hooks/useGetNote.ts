import { useQuery } from "@tanstack/react-query"
import { getNote } from "../api/notes.api"

/**
 * Fetch a single note by its ID.
 *
 * This hook uses React Query to handle fetching,
 * caching, and loading states.
 *
 * @param id Note ID.
 */
export const useGetNote = (
    id: string,
    enabled = true
) => {
    return useQuery({
        queryKey: ["note", id],
        queryFn: () => getNote(id),
        enabled
    });
}