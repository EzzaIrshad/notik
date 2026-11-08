import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type RegisterResponse = {
    success: boolean;
    message: string;
};

const mockedRegister = jest.fn<
    (
        data: {
            fullName: string;
            email: string;
            password: string;
        }
    ) => Promise<RegisterResponse>
>();

const mockedToastError = jest.fn<(message: string) => void>();

jest.unstable_mockModule("../../api/auth.api", () => ({
    register: mockedRegister,
}));

jest.unstable_mockModule("sonner", () => ({
    toast: {
        error: mockedToastError,
    },
}));

const { useRegister } = await import("../useRegister");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
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

describe("useRegister", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should register successfully with the provided data", async () => {
        const data = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123",
        };

        const response: RegisterResponse = {
            success: true,
            message: "Registration successful.",
        };

        mockedRegister.mockResolvedValueOnce(response);

        const { result } = renderHook(() => useRegister(), {
            wrapper: createWrapper(),
        });

        result.current.mutate(data);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedRegister.mock.calls[0][0]).toEqual(data);
        expect(mockedRegister).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
        expect(mockedToastError).not.toHaveBeenCalled();
    });

    it("should show the backend error message when registration fails", async () => {
        const data = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123"
        }

        const error = {
            response: {
                data: { message: "Email already exists." }
            }
        };

        mockedRegister.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useRegister(), {
            wrapper: createWrapper()
        });

        result.current.mutate(data);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockedRegister.mock.calls[0][0]).toEqual(data);
        expect(mockedRegister).toHaveBeenCalledTimes(1);
        expect(mockedToastError).toHaveBeenCalledWith( "Email already exists." )
    });

    it("should show a fallback error message when the backend does not provide one", async () => {
        const data = {
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123"
        };

        const error = new Error("Network error");

        mockedRegister.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useRegister(), {
            wrapper: createWrapper()
        });

        result.current.mutate(data);

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(mockedToastError).toHaveBeenCalledWith( "Something went wrong." );
    });
});