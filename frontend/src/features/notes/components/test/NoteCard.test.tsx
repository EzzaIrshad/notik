import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { Note } from "../../types/notes.types";
import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

const mockNavigate = jest.fn();
const mockUpdateMutate = jest.fn();
const mockDeleteMutate = jest.fn();

let mockUpdateIsPending = false;
let mockDeleteIsPending = false;

jest.unstable_mockModule("react-router-dom", () => {
    const actual = jest.requireActual<typeof import("react-router-dom")>(
        "react-router-dom"
    );

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

jest.unstable_mockModule("../../hooks/useUpdateNote", () => ({
    useUpdateNote: () => ({
        mutate: mockUpdateMutate,
        isPending: mockUpdateIsPending,
    }),
}));

jest.unstable_mockModule("../../hooks/useDeleteNote", () => ({
    useDeleteNote: () => ({
        mutate: mockDeleteMutate,
        isPending: mockDeleteIsPending,
    }),
}));

jest.unstable_mockModule(
    "@/features/notes/components/tiptap-ui-primitive/tooltip",
    () => ({
        Tooltip: ({ children }: { children: ReactNode }) => (
            <div>{children}</div>
        ),
        TooltipTrigger: ({
            children,
            ...props
        }: {
            children: ReactNode;
            [key: string]: unknown;
        }) => <button {...props}>{children}</button>,
        TooltipContent: ({ children }: { children: ReactNode }) => (
            <div>{children}</div>
        ),
    })
);

const AlertDialogContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

jest.unstable_mockModule("@/shared/components/ui/alert-dialog", () => ({
    AlertDialog: ({ children }: { children: ReactNode }) => {
        const [open, setOpen] = useState(false);

        return (
            <AlertDialogContext.Provider value={{ open, setOpen }}>
                {children}
            </AlertDialogContext.Provider>
        );
    },

    AlertDialogTrigger: ({
        children,
        render,
    }: {
        children?: ReactNode;
        render?: ReactNode;
    }) => {
        const context = useContext(AlertDialogContext);

        const trigger = render ?? children;

        if (!React.isValidElement(trigger)) {
            return <>{trigger}</>;
        }

        return React.cloneElement(trigger as React.ReactElement<any>, {
            onClick: () => context?.setOpen(true),
        });
    },

    AlertDialogContent: ({ children }: { children: ReactNode }) => {
        const context = useContext(AlertDialogContext);

        return context?.open ? (
            <div role="alertdialog">{children}</div>
        ) : null;
    },

    AlertDialogHeader: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),

    AlertDialogTitle: ({ children }: { children: ReactNode }) => (
        <h2>{children}</h2>
    ),

    AlertDialogDescription: ({ children }: { children: ReactNode }) => (
        <p>{children}</p>
    ),

    AlertDialogFooter: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),

    AlertDialogCancel: ({ children }: { children: ReactNode }) => {
        const context = useContext(AlertDialogContext);

        return (
            <button onClick={() => context?.setOpen(false)}>
                {children}
            </button>
        );
    },

    AlertDialogAction: ({
        children,
        onClick,
    }: {
        children: ReactNode;
        onClick?: () => void;
    }) => {
        const context = useContext(AlertDialogContext);

        return (
            <button
                onClick={() => {
                    onClick?.();
                    context?.setOpen(false);
                }}
            >
                {children}
            </button>
        );
    },
}));

const { NoteCard } = await import("../NoteCard");

const tone = {
    bg: "#FFF4D6",
    pinColor: "text-yellow-600",
    chip: "#D9A441",
    pillBg: "bg-yellow-100",
};

const noteData: Note = {
    _id: "note-123",
    title: "My Test Note",
    content: "<p>This is my note content.</p>",
    userId: "user-123",
    isPinned: false,
    tags: [],
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z",
};

const renderNoteCard = (note: Note = noteData) => {
    return render(
        <MemoryRouter>
            <NoteCard tone={tone} noteData={note} />
        </MemoryRouter>
    );
};

describe("NoteCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUpdateIsPending = false;
        mockDeleteIsPending = false;
    });

    it("should render the note title, content, and creation date", () => {
        renderNoteCard();

        expect(
            screen.getByRole("heading", { name: "My Test Note" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("This is my note content.")
        ).toBeInTheDocument();

        expect(screen.getByText("Aug 30")).toBeInTheDocument();
    });

    it("should render the pin button for an unpinned note", () => {
        renderNoteCard();

        expect(
            screen.getByRole("button", { name: "Pin note" })
        ).toBeInTheDocument();
    });

    it("should render the unpin button for a pinned note", () => {
        renderNoteCard({
            ...noteData,
            isPinned: true,
        });

        expect(
            screen.getByRole("button", { name: "Unpin note" })
        ).toBeInTheDocument();
    });

    it("should toggle the note pin state", async () => {
        const user = userEvent.setup();

        renderNoteCard();

        await user.click(
            screen.getByRole("button", { name: "Pin note" })
        );

        expect(mockUpdateMutate).toHaveBeenCalledTimes(1);

        expect(mockUpdateMutate).toHaveBeenCalledWith({
            isPinned: true,
        });
    });

    it("should navigate to the note edit page", async () => {
        const user = userEvent.setup();

        renderNoteCard();

        await user.click(
            screen.getByRole("button", { name: "Edit note" })
        );

        expect(mockNavigate).toHaveBeenCalledWith(
            "/notes/note-123/edit"
        );
    });

    it("should open the delete confirmation dialog", async () => {
        const user = userEvent.setup();

        renderNoteCard();

        await user.click(
            screen.getByRole("button", { name: "Delete note" })
        );

        expect(
            screen.getByRole("alertdialog")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Confirm deletion?",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "This note will be permanently deleted."
            )
        ).toBeInTheDocument();
    });

    it("should close the delete dialog when Cancel is clicked", async () => {
        const user = userEvent.setup();

        renderNoteCard();

        await user.click(
            screen.getByRole("button", { name: "Delete note" })
        );

        await user.click(
            screen.getByRole("button", { name: "Cancel" })
        );

        expect(mockDeleteMutate).not.toHaveBeenCalled();
    });

    it("should delete the note when deletion is confirmed", async () => {
        const user = userEvent.setup();

        renderNoteCard();

        await user.click(
            screen.getByRole("button", { name: "Delete note" })
        );

        await user.click(
            screen.getByRole("button", { name: "Delete" })
        );

        expect(mockDeleteMutate).toHaveBeenCalledTimes(1);

        expect(mockDeleteMutate).toHaveBeenCalledWith(
            "note-123",
            expect.objectContaining({
                onSuccess: expect.any(Function),
                onError: expect.any(Function),
            })
        );
    });
});