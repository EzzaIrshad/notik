import { jest } from "@jest/globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type LoginResponse = {
    success: boolean;
    message: string;
};

const mockedLogin = jest.fn<
    (
        data: {
            email: string;
            password: string;
        }
    ) => Promise<LoginResponse>
>();

const mockedToastError = jest.fn<(message: string) => void>();

jest.unstable_mockModule("../../api/auth.api", () => ({
    login: mockedLogin,
}));

jest.unstable_mockModule("sonner", () => ({
    toast: {
        error: mockedToastError,
    },
}));

const { useLogin } = await import("../useLogin");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useLogin", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should login successfully with the provided credentials", async () => {
        const credentials = {
            email: "john@example.com",
            password: "password123",
        };

        const response: LoginResponse = {
            success: true,
            message: "Login successful.",
        };

        mockedLogin.mockResolvedValueOnce(response);

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(credentials);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedLogin.mock.calls[0][0]).toEqual(credentials);
        expect(mockedLogin).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
        expect(mockedToastError).not.toHaveBeenCalled();
    });

    it("should show the backend error message when login fails", async () => {
        const credentials = {
            email: "john@example.com",
            password: "wrong-password",
        };

        const error = {
            response: {
                data: {
                    message: "Invalid email or password.",
                },
            },
        };

        mockedLogin.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(credentials);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockedLogin.mock.calls[0][0]).toEqual(credentials);
        expect(mockedToastError).toHaveBeenCalledWith(
            "Invalid email or password."
        );
    });

    it("should show a fallback error message when the backend does not provide one", async () => {
        const credentials = {
            email: "john@example.com",
            password: "password123",
        };

        const error = new Error("Network error");

        mockedLogin.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useLogin(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(credentials);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockedToastError).toHaveBeenCalledWith(
            "Something went wrong."
        );
    });
});