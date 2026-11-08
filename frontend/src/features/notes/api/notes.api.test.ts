import { jest } from "@jest/globals";

type ApiResponse = {
    data: unknown;
};

const mockedApi = {
    get: jest.fn(
        async (
            _url: string,
            _config?: unknown
        ): Promise<ApiResponse> => ({ data: undefined })
    ),
    post: jest.fn(
        async (
            _url: string,
            _data?: unknown
        ): Promise<ApiResponse> => ({ data: undefined })
    ),
    patch: jest.fn(
        async (
            _url: string,
            _data?: unknown
        ): Promise<ApiResponse> => ({ data: undefined })
    ),
    delete: jest.fn(
        async (
            _url: string
        ): Promise<ApiResponse> => ({ data: undefined })
    ),
};

jest.unstable_mockModule(
    "@/shared/api/axiosInstance",
    () => ({
        api: mockedApi,
    })
);

const {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
} = await import("./notes.api");

describe("notes API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getNotes", () => {
        it("should fetch notes with query parameters and return the response data", async () => {
            const params = {
                search: "javascript",
                sort: "updatedAt" as const,
                order: "desc",
            };

            const responseData = {
                success: true,
                data: [
                    {
                        id: "note-1",
                        title: "JavaScript Notes",
                        content: "Important JavaScript concepts",
                    },
                ],
            };

            mockedApi.get.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await getNotes(params);

            expect(mockedApi.get).toHaveBeenCalledWith(
                "/notes/get-all-notes",
                { params }
            );
            expect(result).toEqual(responseData);
        });

        it("should fetch notes without query parameters", async () => {
            const responseData = {
                success: true,
                data: [],
            };

            mockedApi.get.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await getNotes();

            expect(mockedApi.get).toHaveBeenCalledWith(
                "/notes/get-all-notes",
                { params: undefined }
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to fetch notes");

            mockedApi.get.mockRejectedValueOnce(error);

            await expect(getNotes()).rejects.toThrow(
                "Failed to fetch notes"
            );
        });
    });

    describe("getNote", () => {
        it("should fetch a note by id and return the response data", async () => {
            const noteId = "note-123";

            const responseData = {
                success: true,
                data: {
                    id: noteId,
                    title: "Test Note",
                    content: "Test content",
                },
            };

            mockedApi.get.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await getNote(noteId);

            expect(mockedApi.get).toHaveBeenCalledWith(
                `/notes/get-note/${noteId}`
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to fetch note");

            mockedApi.get.mockRejectedValueOnce(error);

            await expect(getNote("note-123")).rejects.toThrow(
                "Failed to fetch note"
            );
        });
    });

    describe("createNote", () => {
        it("should create a note and return the response data", async () => {
            const noteData = {
                title: "New Note",
                content: "Note content",
                tags: ["javascript", "typescript"],
                isPinned: false,
            };

            const responseData = {
                success: true,
                data: {
                    id: "note-123",
                    ...noteData,
                },
            };

            mockedApi.post.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await createNote(noteData);

            expect(mockedApi.post).toHaveBeenCalledWith(
                "/notes/create",
                noteData
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to create note");

            mockedApi.post.mockRejectedValueOnce(error);

            await expect(
                createNote({
                    title: "New Note",
                })
            ).rejects.toThrow("Failed to create note");
        });
    });

    describe("updateNote", () => {
        it("should update a note and return the response data", async () => {
            const noteId = "note-123";

            const noteData = {
                title: "Updated Note",
                content: "Updated content",
                tags: ["updated"],
                isPinned: true,
            };

            const responseData = {
                success: true,
                data: {
                    id: noteId,
                    ...noteData,
                },
            };

            mockedApi.patch.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await updateNote(noteId, noteData);

            expect(mockedApi.patch).toHaveBeenCalledWith(
                `/notes/update/${noteId}`,
                noteData
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to update note");

            mockedApi.patch.mockRejectedValueOnce(error);

            await expect(
                updateNote("note-123", {
                    title: "Updated Note",
                })
            ).rejects.toThrow("Failed to update note");
        });
    });

    describe("deleteNote", () => {
        it("should delete a note and return the response data", async () => {
            const noteId = "note-123";

            const responseData = {
                success: true,
                message: "Note deleted successfully.",
            };

            mockedApi.delete.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await deleteNote(noteId);

            expect(mockedApi.delete).toHaveBeenCalledWith(
                `/notes/delete/${noteId}`
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to delete note");

            mockedApi.delete.mockRejectedValueOnce(error);

            await expect(deleteNote("note-123")).rejects.toThrow(
                "Failed to delete note"
            );
        });
    });
});