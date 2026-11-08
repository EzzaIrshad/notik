import { useQuery } from "@tanstack/react-query"
import { getNotes } from "../api/notes.api"
import type { NotesQueryParams } from "../types/notes.types"


/**
 * Custom hook to fetch notes based on optional query parameters.
 * This hook utilizes React Query's useQuery to manage the fetching state and caching.
 * @param params 
 * @returns 
 */
export const useGetNotes = (params?: NotesQueryParams) => {
    return useQuery({
        queryKey: ["notes", params],
        queryFn: () => getNotes(params)
    });
}