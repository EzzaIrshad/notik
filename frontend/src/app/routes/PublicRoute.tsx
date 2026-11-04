import { useGetUser } from "@/features/auth/hooks/useGetUser"
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import axios from "axios";
import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = (): ReactElement => {
    const { data, isLoading, isError, error } = useGetUser();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 404)
        ) {
            return <Outlet />;
        }
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <p className="text-lg font-semibold text-red-500">Something went wrong. Please try again later.</p>
            </div>
        )
    }

    if (data?.data) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />
}

export default PublicRoute