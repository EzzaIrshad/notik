import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";
import type { useGetNote } from "../../hooks/useGetNote";
import type { useUpdateNote } from "../../hooks/useUpdateNote";
import type { CreateNoteInput } from "../../schemas/note.schema";

const mockNavigate = jest.fn<NavigateFunction>();

type CreateNoteData = CreateNoteInput;

type CreateMutationOptions = {
    onSuccess?: () => void;
    onError?: () => void;
};

const mockCreateMutate = jest.fn<
    (data: CreateNoteData, options?: CreateMutationOptions) => void
>();

const mockUpdateMutate =
    jest.fn<ReturnType<typeof useUpdateNote>["mutate"]>();

let mockNote: ReturnType<typeof useGetNote>["data"] = undefined;
let mockIsEdit = false;

jest.unstable_mockModule("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({
        id: mockIsEdit ? "note-123" : undefined,
    }),
}));

jest.unstable_mockModule("../../hooks/useGetNote", () => ({
    useGetNote: () => ({
        data: mockNote,
    }),
}));

jest.unstable_mockModule("../../hooks/useCreateNote", () => ({
    useCreateNote: () => ({
        mutate: mockCreateMutate,
        isPending: false,
    }),
}));

jest.unstable_mockModule("../../hooks/useUpdateNote", () => ({
    useUpdateNote: () => ({
        mutate: mockUpdateMutate,
        isPending: false,
    }),
}));

jest.unstable_mockModule("../../components/EditorTopBar", () => ({
    default: ({
        isEdit,
    }: {
        isEdit: boolean;
        isSubmitting: boolean;
    }) => (
        <button type="submit" form="note-editor-form">
            {isEdit ? "Update Note" : "Create Note"}
        </button>
    ),
}));

jest.unstable_mockModule("../../components/TextEditor", () => ({
    default: ({
        value,
        onChange,
    }: {
        value: string;
        onChange: (value: string) => void;
    }) => (
        <textarea
            aria-label="Note content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

jest.unstable_mockModule("../../components/TagInput", () => ({
    default: ({
        value,
        onChange,
    }: {
        value: string[];
        onChange: (value: string[]) => void;
    }) => (
        <input
            aria-label="Tags"
            value={value.join(", ")}
            onChange={(e) =>
                onChange(
                    e.target.value
                        ? e.target.value.split(",").map((tag) => tag.trim())
                        : []
                )
            }
        />
    ),
}));

const { default: NoteEditorPage } = await import("../NoteEditorPage");

const renderPage = () =>
    render(
        <MemoryRouter>
            <NoteEditorPage />
        </MemoryRouter>
    );

describe("NoteEditorPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNote = undefined;
        mockIsEdit = false;
    });

    it("should render create mode", () => {
        renderPage();

        expect(screen.getByText("New note")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Untitled note")
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Create Note" })
        ).toBeInTheDocument();
    });

    it("should show validation errors for an empty note", async () => {
        const user = userEvent.setup();

        renderPage();

        await user.click(
            screen.getByRole("button", { name: "Create Note" })
        );

        expect(
            await screen.findByText("Title cannot be empty.")
        ).toBeInTheDocument();

        expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it("should create a note and navigate to dashboard", async () => {
        const user = userEvent.setup();

        renderPage();

        await user.type(
            screen.getByPlaceholderText("Untitled note"),
            "My first note"
        );

        await user.type(
            screen.getByRole("textbox", { name: "Note content" }),
            "Some note content"
        );

        await user.click(
            screen.getByRole("button", { name: "Create Note" })
        );

        await waitFor(() => {
            expect(mockCreateMutate).toHaveBeenCalledTimes(1);
        });

        const [data, options] = mockCreateMutate.mock.calls[0];

        expect(data).toEqual({
            title: "My first note",
            content: "Some note content",
            tags: [],
            isPinned: false,
        });

        options?.onSuccess?.();

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    it("should load an existing note in edit mode", async () => {
        mockIsEdit = true;

        mockNote = {
            success: true,
            message: "Note fetched successfully",
            data: {
                _id: "note-123",
                title: "Existing note",
                content: "Existing content",
                userId: "user-1",
                tags: ["work", "important"],
                isPinned: true,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
            },
        };

        renderPage();

        expect(screen.getByText("Editing note")).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByDisplayValue("Existing note")
            ).toBeInTheDocument();

            expect(
                screen.getByDisplayValue("Existing content")
            ).toBeInTheDocument();

            expect(
                screen.getByDisplayValue("work, important")
            ).toBeInTheDocument();
        });
    });

    it("should update an existing note", async () => {
        const user = userEvent.setup();

        mockIsEdit = true;

        mockNote = {
            success: true,
            message: "Note fetched successfully",
            data: {
                _id: "note-123",
                title: "Existing note",
                content: "Existing content",
                userId: "user-1",
                tags: [],
                isPinned: false,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
            },
        };

        renderPage();

        const titleInput = await screen.findByDisplayValue("Existing note");

        await user.clear(titleInput);
        await user.type(titleInput, "Updated note");

        await user.click(
            screen.getByRole("button", { name: "Update Note" })
        );

        await waitFor(() => {
            expect(mockUpdateMutate).toHaveBeenCalledTimes(1);
        });

        expect(mockUpdateMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Updated note",
            }),
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });
});