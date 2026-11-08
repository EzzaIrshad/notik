import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type DeleteNoteResponse = {
    success: boolean;
    message: string;
};

const mockedDeleteNote = jest.fn<
    (id: string) => Promise<DeleteNoteResponse>
>();

jest.unstable_mockModule("../../api/notes.api", () => ({
    deleteNote: mockedDeleteNote,
}));

const { useDeleteNote } = await import("../useDeleteNote");

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useDeleteNote", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the note successfully", async () => {
        const noteId = "note-123";

        const response: DeleteNoteResponse = {
            success: true,
            message: "Note deleted successfully.",
        };

        mockedDeleteNote.mockResolvedValueOnce(response);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useDeleteNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate(noteId);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedDeleteNote.mock.calls[0][0]).toBe(noteId);
        expect(mockedDeleteNote).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should invalidate notes and remove the specific note query after successful deletion", async () => {
        const noteId = "note-123";

        mockedDeleteNote.mockResolvedValueOnce({
            success: true,
            message: "Note deleted successfully.",
        });

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const invalidateQueriesSpy = jest.spyOn(
            queryClient,
            "invalidateQueries"
        );

        const removeQueriesSpy = jest.spyOn(
            queryClient,
            "removeQueries"
        );

        const { result } = renderHook(() => useDeleteNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate(noteId);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["notes"],
        });

        expect(removeQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["note", noteId],
        });
    });

    it("should expose an error when note deletion fails", async () => {
        const error = new Error("Failed to delete note");

        mockedDeleteNote.mockRejectedValueOnce(error);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useDeleteNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate("note-123");

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedDeleteNote).toHaveBeenCalledTimes(1);
    });
});