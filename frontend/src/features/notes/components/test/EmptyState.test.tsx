import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.unstable_mockModule("@/assets/empty-state.png", () => ({
    default: "empty-state.png",
}));

const {
    EmptyState,
    EmptySearchState,
    EmptyPinnedState,
} = await import("../EmptyState");

describe("EmptyState", () => {
    it("should render the empty state content", () => {
        render(
            <MemoryRouter>
                <EmptyState />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", {
                name: "Your notebook is waiting.",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Create your first note and start organizing your ideas beautifully."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", {
                name: "Create note",
            })
        ).toHaveAttribute("href", "/notes/new");
    });

    it("should render the empty state illustration", () => {
        render(
            <MemoryRouter>
                <EmptyState />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("presentation")
        ).toBeInTheDocument();
    });
});

describe("EmptySearchState", () => {
    it("should display the search query when no notes are found", () => {
        render(<EmptySearchState search="javascript" />);

        expect(
            screen.getByRole("heading", {
                name: "No notes found",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText('No notes match "javascript"')
        ).toBeInTheDocument();
    });
});

describe("EmptyPinnedState", () => {
    it("should render the pinned notes empty state", () => {
        render(<EmptyPinnedState />);

        expect(
            screen.getByRole("heading", {
                name: "You haven't pinned any notes yet.",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Pin your important notes to keep them easily accessible and organized."
            )
        ).toBeInTheDocument();
    });
});