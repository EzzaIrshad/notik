import { useGetUser } from "@/features/auth/hooks/useGetUser"
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import axios from "axios";
import type { ReactElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = (): ReactElement => {
    const { data, isLoading, isError, error } = useGetUser();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        if ( axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 404)) {
            return <Navigate to="/login" state={{ from: location }} replace />
        }
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <p className="text-lg font-semibold text-red-500">Something went wrong. Please try again later.</p>
            </div>
        )
    }

    if (!data?.data) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default ProtectedRoute