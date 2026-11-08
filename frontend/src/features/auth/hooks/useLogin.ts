import type { ErrorResponse } from "../types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Custom hook to manage user authentication state during login
export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onError: (error: AxiosError<ErrorResponse>) => {
            // Display backend error message or fallback to a generic message
            toast.error(error.response?.data?.message ?? "Something went wrong.");
        }
    });
};