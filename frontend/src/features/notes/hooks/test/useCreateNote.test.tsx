import { jest } from "@jest/globals";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

type CreateNoteInput = {
    title: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
};

type NoteResponse = {
    success: boolean;
    message: string;
};

const mockedCreateNote = jest.fn<
    (data: CreateNoteInput) => Promise<NoteResponse>
>();

jest.unstable_mockModule("../../api/notes.api", () => ({
    createNote: mockedCreateNote,
}));

const { useCreateNote } = await import("../useCreateNote");

const createWrapper = (queryClient: QueryClient) => {
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useCreateNote", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a note successfully", async () => {
        const noteData: CreateNoteInput = {
            title: "Test note",
            content: "Test content",
            tags: ["testing"],
            isPinned: false,
        };

        const response: NoteResponse = {
            success: true,
            message: "Note created successfully.",
        };

        mockedCreateNote.mockResolvedValueOnce(response);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useCreateNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate(noteData);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockedCreateNote.mock.calls[0][0]).toEqual(noteData);
        expect(mockedCreateNote).toHaveBeenCalledTimes(1);
        expect(result.current.data).toEqual(response);
    });

    it("should invalidate the notes query after successful creation", async () => {
        const noteData: CreateNoteInput = {
            title: "Test note",
            content: "Test content",
        };

        mockedCreateNote.mockResolvedValueOnce({
            success: true,
            message: "Note created successfully.",
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

        const { result } = renderHook(() => useCreateNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate(noteData);

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ["notes"],
        });
    });

    it("should expose an error when note creation fails", async () => {
        const error = new Error("Failed to create note");

        mockedCreateNote.mockRejectedValueOnce(error);

        const queryClient = new QueryClient({
            defaultOptions: {
                mutations: {
                    retry: false,
                },
            },
        });

        const { result } = renderHook(() => useCreateNote(), {
            wrapper: createWrapper(queryClient),
        });

        result.current.mutate({
            title: "Test note",
            content: "Test content",
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
        expect(mockedCreateNote).toHaveBeenCalledTimes(1);
    });
});