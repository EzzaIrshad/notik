import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type NoteResponse = {
    success: boolean;
    message: string;
};

const mockedGetNote = jest.fn<
    (id: string) => Promise<NoteResponse>
>();

jest.unstable_mockModule("../../api/notes.api", () => ({
    getNote: mockedGetNote,
}));

const { useGetNote } = await import("../useGetNote");

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

describe("useGetNote", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch and return the requested note", async () => {
        const noteId = "note-123";

        const response: NoteResponse = {
            success: true,
            message: "Note fetched successfully.",
        };

        mockedGetNote.mockResolvedValueOnce(response);

        const { result } = renderHook(
            () => useGetNote(noteId),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedGetNote.mock.calls[0][0]).toBe(noteId);
        expect(mockedGetNote).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should expose an error when fetching the note fails", async () => {
        const error = new Error("Failed to fetch note");

        mockedGetNote.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => useGetNote("note-123"),
            {
                wrapper: createWrapper(),
            }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedGetNote).toHaveBeenCalledTimes(1);
    });

    it("should not fetch the note when enabled is false", async () => {
        const { result } = renderHook(
            () => useGetNote("note-123", false),
            {
                wrapper: createWrapper(),
            }
        );

        expect(result.current.isPending).toBe(true);
        expect(mockedGetNote).not.toHaveBeenCalled();
    });
});