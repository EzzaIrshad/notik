import { jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import type { DashboardTab } from "../../layouts/DashboardLayout";
import type { useGetNotes } from "../../hooks/useGetNotes";
import type NotesPanel from "../../components/NotesPanel";
import { MemoryRouter } from "react-router-dom";

type DashboardContext = {
    search: string;
    tab: DashboardTab;
    setTab: (tab: DashboardTab) => void;
};

type NotesQueryParams = Parameters<typeof useGetNotes>[0];
type NotesQueryResult = ReturnType<typeof useGetNotes>;
type NotesPanelProps = ComponentProps<typeof NotesPanel>;

const mockUseGetNotes = jest.fn<
    (params?: NotesQueryParams) => NotesQueryResult
>();

const mockUseOutletContext = jest.fn<() => DashboardContext>();

const mockNotesPanel = jest.fn<(props: NotesPanelProps) => void>();

jest.unstable_mockModule("react-router-dom", () => {
    const actual = jest.requireActual<typeof import("react-router-dom")>(
        "react-router-dom"
    );

    return {
        ...actual,
        useOutletContext: mockUseOutletContext,
    };
});

jest.unstable_mockModule("../../hooks/useGetNotes", () => ({
    useGetNotes: mockUseGetNotes,
}));

jest.unstable_mockModule("../../components/NotesPanel", () => ({
    default: (props: NotesPanelProps) => {
        mockNotesPanel(props);

        return (
            <div data-testid="notes-panel">
                Notes Panel
            </div>
        )
    }
}));

const { default: DashboardPage } = await import("../DashboardPage");

describe("DashboardPage", () => {
    const mockSetTab = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseOutletContext.mockReturnValue({
            search: "",
            tab: "all-notes",
            setTab: mockSetTab,
        });

        mockUseGetNotes.mockReturnValue({
            data: {
                success: true,
                message: "Notes fetched successfully",
                data: [
                    {
                        _id: "1",
                        title: "First Note",
                        content: "",
                        userId: "user-1",
                        isPinned: false,
                        tags: [],
                        createdAt: "",
                        updatedAt: "",
                    },
                    {
                        _id: "2",
                        title: "Second Note",
                        content: "",
                        userId: "user-1",
                        isPinned: false,
                        tags: [],
                        createdAt: "",
                        updatedAt: "",
                    },
                ],
            },
            isLoading: false,
        } as unknown as NotesQueryResult);
    });

    const renderDashboard = () => {
        return render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );
    };

    it("should render the NotesPanel", () => {
        renderDashboard();

        expect(
            screen.getByTestId("notes-panel")
        ).toBeInTheDocument();
    });

    it("should call useGetNotes with default parameters", () => {
        renderDashboard();

        expect(mockUseGetNotes).toHaveBeenCalledWith({
            search: undefined,
            isPinned: undefined,
            sort: "createdAt",
        });
    });

    it("should pass search to useGetNotes", () => {
        mockUseOutletContext.mockReturnValue({
            search: "meeting",
            tab: "all-notes",
            setTab: mockSetTab,
        });

        renderDashboard();

        expect(mockUseGetNotes).toHaveBeenCalledWith({
            search: "meeting",
            isPinned: undefined,
            sort: "createdAt",
        });
    });

    it("should request only pinned notes when the pinned tab is active", () => {
        mockUseOutletContext.mockReturnValue({
            search: "",
            tab: "pinned",
            setTab: mockSetTab,
        });

        renderDashboard();

        expect(mockUseGetNotes).toHaveBeenCalledWith({
            search: undefined,
            isPinned: true,
            sort: "createdAt",
        });
    });

    it("should pass notes and loading state to NotesPanel", () => {
        const notes = [
            {
                _id: "1",
                title: "First Note",
                content: "First note content",
                userId: "user-1",
                isPinned: false,
                tags: [],
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
            },
            {
                _id: "2",
                title: "Second Note",
                content: "Second note content",
                userId: "user-1",
                isPinned: false,
                tags: [],
                createdAt: "2026-01-02T00:00:00.000Z",
                updatedAt: "2026-01-02T00:00:00.000Z",
            },
        ];

        mockUseGetNotes.mockReturnValue({
            data: {
                success: true,
                message: "Notes fetched successfully",
                data: notes,
            },
            isLoading: false,
        } as unknown as NotesQueryResult);

        renderDashboard();

        expect(mockNotesPanel).toHaveBeenCalledWith(
            expect.objectContaining({
                notes,
                isLoading: false,
                tab: "all-notes",
                search: "",
                sort: "createdAt",
                setTab: mockSetTab,
                setSort: expect.any(Function),
            })
        );
    });

    it("should pass loading state to NotesPanel", () => {
        mockUseGetNotes.mockReturnValue({
            data: undefined,
            isLoading: true,
        } as unknown as NotesQueryResult);

        renderDashboard();

        expect(mockNotesPanel).toHaveBeenCalledWith(
            expect.objectContaining({
                notes: [],
                isLoading: true,
            })
        );
    });

    it("should render the create new note link", () => {
        renderDashboard();

        const createNoteLink = screen.getByRole("link", {
            name: "Create new note",
        });

        expect(createNoteLink).toHaveAttribute(
            "href",
            "/notes/new"
        );
    });

    it("should use an empty notes array when no data is returned", () => {
        mockUseGetNotes.mockReturnValue({
            data: undefined,
            isLoading: false,
        } as unknown as NotesQueryResult);

        renderDashboard();

        expect(mockNotesPanel).toHaveBeenCalledWith(
            expect.objectContaining({
                notes: [],
                isLoading: false,
            })
        );
    });

    it("should update the sort value when setSort is called", async () => {
        renderDashboard();

        const firstCallProps = mockNotesPanel.mock.calls[0][0];

        firstCallProps.setSort("updatedAt");

        await waitFor(() => {
            expect(mockUseGetNotes).toHaveBeenLastCalledWith({
                search: undefined,
                isPinned: undefined,
                sort: "updatedAt",
            });
        });
    });
});