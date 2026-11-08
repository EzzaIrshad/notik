import { jest } from "@jest/globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

type UserResponse = {
    success: boolean;
    data: {
        id: string;
        fullName: string;
        email: string;
    };
};

const mockedGetCurrentUser = jest.fn<
    () => Promise<UserResponse>
>();

jest.unstable_mockModule("../../api/auth.api", () => ({
    getCurrentUser: mockedGetCurrentUser,
}));

const { useGetUser } = await import("../useGetUser");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useGetUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return the current user when the request succeeds", async () => {
        const response: UserResponse = {
            success: true,
            data: {
                id: "user-123",
                fullName: "John Doe",
                email: "john@example.com",
            },
        };

        mockedGetCurrentUser.mockResolvedValueOnce(response);

        const { result } = renderHook(() => useGetUser(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(response);
        expect(mockedGetCurrentUser).toHaveBeenCalledTimes(1);
    });

    it("should expose an error when the request fails", async () => {
        const error = new Error("Failed to fetch user");

        mockedGetCurrentUser.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useGetUser(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedGetCurrentUser).toHaveBeenCalledTimes(1);
    });
});