import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

import type { Note } from "../../types/notes.types";
import type { DashboardTab } from "../../layouts/DashboardLayout";

jest.unstable_mockModule("@/shared/components/ui/tabs", () => {
    let activeValue = "";

    const Tabs = ({
        children,
        value,
        onValueChange,
    }: {
        children: ReactNode;
        value: string;
        onValueChange: (value: string) => void;
    }) => {
        activeValue = value;

        return (
            <div data-testid="tabs">
                <div data-testid="tabs-value">{value}</div>

                <button
                    data-testid="change-tab"
                    onClick={() => onValueChange("pinned")}
                >
                    Change tab
                </button>

                {children}
            </div>
        );
    };

    const TabsList = ({ children }: { children: ReactNode }) => (
        <div role="tablist">{children}</div>
    );

    const TabsTrigger = ({
        children,
        value,
    }: {
        children: ReactNode;
        value: string;
    }) => (
        <button role="tab" data-value={value}>
            {children}
        </button>
    );

    const TabsContent = ({
        children,
        value,
    }: {
        children: ReactNode;
        value: string;
    }) => {
        if (value !== activeValue) {
            return null;
        }

        return (
            <div data-testid={`tabs-content-${value}`}>
                {children}
            </div>
        );
    };

    return {
        Tabs,
        TabsList,
        TabsTrigger,
        TabsContent,
    };
});

// Mock NoteCard
jest.unstable_mockModule("../NoteCard", () => ({
    NoteCard: ({
        noteData,
    }: {
        noteData: Note;
    }) => (
        <div data-testid="note-card">
            {noteData.title}
        </div>
    ),
}));

// Mock SortMenu
jest.unstable_mockModule("../SortMenu", () => ({
    default: ({
        sort,
        setSort,
    }: {
        sort: "createdAt" | "updatedAt";
        setSort: (sort: "createdAt" | "updatedAt") => void;
    }) => (
        <div>
            <span data-testid="current-sort">{sort}</span>
            <button onClick={() => setSort("updatedAt")}>
                Change sort
            </button>
        </div>
    ),
}));

// Mock EmptyState components
jest.unstable_mockModule("../EmptyState", () => ({
    EmptyState: () => (
        <div data-testid="empty-state">No notes</div>
    ),
    EmptyPinnedState: () => (
        <div data-testid="empty-pinned-state">
            No pinned notes
        </div>
    ),
    EmptySearchState: ({ search }: { search: string }) => (
        <div data-testid="empty-search-state">
            No results for {search}
        </div>
    ),
}));

// Mock CardSkeleton
jest.unstable_mockModule("@/shared/components/ui/skeleton", () => ({
    CardSkeleton: () => (
        <div data-testid="card-skeleton" />
    ),
}));

// Import after mocks
const { default: NotesPanel } = await import("../NotesPanel");

const createNote = (
    overrides: Partial<Note> = {}
): Note => ({
    _id: "note-1",
    title: "Test Note",
    content: "Test content",
    userId: "user-1",
    isPinned: false,
    tags: [],
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T00:00:00.000Z",
    ...overrides,
});

const renderNotesPanel = ({
    notes = [],
    isLoading = false,
    tab = "all-notes",
    setTab = jest.fn(),
    search = "",
    sort = "createdAt",
    setSort = jest.fn(),
}: {
    notes?: Note[];
    isLoading?: boolean;
    tab?: DashboardTab;
    setTab?: (tab: DashboardTab) => void;
    search?: string;
    sort?: "createdAt" | "updatedAt";
    setSort?: (sort: "createdAt" | "updatedAt") => void;
} = {}) => {
    return render(
        <MemoryRouter>
            <NotesPanel
                notes={notes}
                isLoading={isLoading}
                tab={tab}
                setTab={setTab}
                search={search}
                sort={sort}
                setSort={setSort}
            />
        </MemoryRouter>
    );
};

describe("NotesPanel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render All Notes and Pinned tabs", () => {
        renderNotesPanel();

        expect(
            screen.getByRole("tab", { name: /All Notes/i })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("tab", { name: /Pinned/i })
        ).toBeInTheDocument();
    });

    it("should show correct note counts", () => {
        const notes = [
            createNote({ _id: "1", isPinned: false }),
            createNote({ _id: "2", isPinned: true }),
            createNote({ _id: "3", isPinned: true }),
        ];

        renderNotesPanel({ notes });

        expect(
            screen.getByRole("tab", { name: /All Notes/i })
        ).toHaveTextContent("3");

        expect(
            screen.getByRole("tab", { name: /Pinned/i })
        ).toHaveTextContent("2");
    });

    it("should render note cards when notes are available", () => {
        const notes = [
            createNote({
                _id: "1",
                title: "First Note",
            }),
            createNote({
                _id: "2",
                title: "Second Note",
            }),
        ];

        renderNotesPanel({ notes });

        expect(screen.getAllByTestId("note-card")).toHaveLength(2);

        expect(screen.getByText("First Note")).toBeInTheDocument();
        expect(screen.getByText("Second Note")).toBeInTheDocument();
    });

    it("should show loading skeletons while notes are loading", () => {
        renderNotesPanel({
            isLoading: true,
        });

        expect(
            screen.getAllByTestId("card-skeleton")
        ).toHaveLength(2);

        expect(
            screen.queryByTestId("empty-state")
        ).not.toBeInTheDocument();
    });

    it("should show the empty state when there are no notes", () => {
        renderNotesPanel({
            notes: [],
            tab: "all-notes",
        });

        expect(
            screen.getByTestId("empty-state")
        ).toBeInTheDocument();
    });

    it("should change to the pinned tab", async () => {
        const user = userEvent.setup();
        const setTab = jest.fn();

        renderNotesPanel({
            notes: [],
            tab: "all-notes",
            setTab,
        });

        await user.click(
            screen.getByRole("button", { name: "Change tab" })
        );

        expect(setTab).toHaveBeenCalledWith("pinned");
    });

    it("should show the search empty state when search has no results", () => {
        renderNotesPanel({
            notes: [],
            search: "meeting",
            tab: "all-notes",
        });

        expect(
            screen.getByTestId("empty-search-state")
        ).toHaveTextContent("meeting");
    });

    it("should render the Create new note link", () => {
        renderNotesPanel();

        const createLink = screen.getByRole("link", {
            name: /Create new note|Create/i,
        });

        expect(createLink).toHaveAttribute(
            "href",
            "/notes/new"
        );
    });

    it("should render the current sort value", () => {
        renderNotesPanel({
            sort: "createdAt",
        });

        const sortValues = screen.getAllByTestId("current-sort");

        expect(sortValues).toHaveLength(2);
        expect(sortValues[0]).toHaveTextContent("createdAt");
        expect(sortValues[1]).toHaveTextContent("createdAt");
    });

    it("should call setSort when the sort option changes", async () => {
        const user = userEvent.setup();
        const setSort = jest.fn();

        renderNotesPanel({
            sort: "createdAt",
            setSort,
        });
        await user.click(
            screen.getAllByRole("button", {
                name: "Change sort",
            })[0]
        );

        expect(setSort).toHaveBeenCalledWith("updatedAt");
    });
});