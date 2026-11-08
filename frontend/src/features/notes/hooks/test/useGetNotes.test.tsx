import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { NotesQueryParams } from "../../types/notes.types";
import type { ReactNode } from "react";

type NotesResponse = {
    success: boolean;
    message: string;
};

const mockedGetNotes = jest.fn<
    (params?: NotesQueryParams) => Promise<NotesResponse>
>();

jest.unstable_mockModule("../../api/notes.api", () => ({
    getNotes: mockedGetNotes,
}));

const { useGetNotes } = await import("../useGetNotes");

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
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

describe("useGetNotes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch notes with the provided query parameters", async () => {
        const params: NotesQueryParams = {
            search: "test",
            sort: "updatedAt",
            isPinned: true,
        };

        const response: NotesResponse = {
            success: true,
            message: "Notes fetched successfully.",
        };

        mockedGetNotes.mockResolvedValueOnce(response);

        const { result } = renderHook(
            () => useGetNotes(params),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedGetNotes.mock.calls[0][0]).toEqual(params);
        expect(mockedGetNotes).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should fetch notes without query parameters", async () => {
        const response: NotesResponse = {
            success: true,
            message: "Notes fetched successfully.",
        };

        mockedGetNotes.mockResolvedValueOnce(response);

        const { result } = renderHook(
            () => useGetNotes(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedGetNotes.mock.calls[0][0]).toBeUndefined();
        expect(mockedGetNotes).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should expose an error when fetching notes fails", async () => {
        const error = new Error("Failed to fetch notes");

        mockedGetNotes.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => useGetNotes(),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedGetNotes).toHaveBeenCalledTimes(1);
    });
});