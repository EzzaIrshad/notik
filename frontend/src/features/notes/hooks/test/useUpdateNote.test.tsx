import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type UpdateNoteInput = {
    title?: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
};

type NoteResponse = {
    success: boolean;
    message: string;
};

const mockedUpdateNote = jest.fn<
    (id: string, data: UpdateNoteInput) => Promise<NoteResponse>
>();

jest.unstable_mockModule("../../api/notes.api", () => ({
    updateNote: mockedUpdateNote,
}));

const { useUpdateNote } = await import("../useUpdateNote");

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useUpdateNote", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the note successfully", async () => {
        const noteId = "note-123";

        const updateData: UpdateNoteInput = {
            title: "Updated note",
            content: "Updated content",
            tags: ["updated"],
            isPinned: true,
        };

        const response: NoteResponse = {
            success: true,
            message: "Note updated successfully.",
        };

        mockedUpdateNote.mockResolvedValueOnce(response);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useUpdateNote(noteId), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate(updateData);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedUpdateNote.mock.calls[0][0]).toBe(noteId);
        expect(mockedUpdateNote.mock.calls[0][1]).toEqual(updateData);
        expect(mockedUpdateNote).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should invalidate notes and the specific note query after successful update", async () => {
        const noteId = "note-123";

        mockedUpdateNote.mockResolvedValueOnce({
            success: true,
            message: "Note updated successfully.",
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

        const { result } = renderHook(() => useUpdateNote(noteId), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate({
            title: "Updated note",
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["notes"],
        });

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["note", noteId],
        });

        expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
    });

    it("should expose an error when note update fails", async () => {
        const error = new Error("Failed to update note");

        mockedUpdateNote.mockRejectedValueOnce(error);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useUpdateNote("note-123"), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate({
            title: "Updated note",
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedUpdateNote).toHaveBeenCalledTimes(1);
    });
});