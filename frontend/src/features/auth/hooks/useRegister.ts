import type { ErrorResponse } from "../types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth.api";
import type { AxiosError } from "axios";
import { toast } from "sonner";

// Custom hook to manage user authentication state during registration
export const useRegister = () => {
    return useMutation({
        mutationFn: register,
        onError: (error: AxiosError<ErrorResponse>) => {
            // Display backend error message or fallback to a generic message
            toast.error(error.response?.data?.message ?? "Something went wrong.");
        }
    });
};