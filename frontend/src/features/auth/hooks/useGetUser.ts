import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../api/auth.api"

/**
 * get the current user and cache its info
 * @returns 
 */
export const useGetUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser
    });
}