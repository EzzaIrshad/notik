import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../api/auth.api";


/**
 * logout the current user and remove the cached user info
 * @returns 
 */
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["currentUser"],
            })
        }
    })
}