import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type LogoutResponse = {
    success: boolean;
    message: string;
};

const mockedLogout = jest.fn<
    () => Promise<LogoutResponse>
>();

jest.unstable_mockModule("../../api/auth.api", () => ({
    logout: mockedLogout,
}));

const { useLogout } = await import("../useLogout");

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useLogout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should logout successfully", async () => {
        const response: LogoutResponse = {
            success: true,
            message: "Logout successful.",
        };

        mockedLogout.mockResolvedValueOnce(response);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useLogout(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate();

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedLogout).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should remove the currentUser query after successful logout", async () => {
        const currentUser = {
            success: true,
            data: {
                id: "user-123",
                fullName: "John Doe",
                email: "john@example.com",
            },
        };

        mockedLogout.mockResolvedValueOnce({
            success: true,
            message: "Logout successful.",
        });

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        queryClient.setQueryData(["currentUser"], currentUser);

        expect(
            queryClient.getQueryData(["currentUser"])
        ).toEqual(currentUser);

        const { result } = renderHook(() => useLogout(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate();

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(
            queryClient.getQueryData(["currentUser"])
        ).toBeUndefined();
    });

    it("should expose an error when logout fails", async () => {
        const error = new Error("Logout failed");

        mockedLogout.mockRejectedValueOnce(error);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useLogout(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate();

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedLogout).toHaveBeenCalledTimes(1);
    });
});