import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditorTopBar from "../EditorTopBar";

describe("EditorTopBar", () => {
    const renderComponent = (
        isEdit = false,
        isSubmitting = false
    ) => {
        return render(
            <MemoryRouter>
                <EditorTopBar
                    isEdit={isEdit}
                    isSubmitting={isSubmitting}
                />
            </MemoryRouter>
        );
    };

    it("should render new note state", () => {
        renderComponent();

        expect(screen.getByText("New note")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Create note" })
        ).toBeInTheDocument();
    });

    it("should render edit note state", () => {
        renderComponent(true);

        expect(screen.getByText("Edit note")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save changes" })
        ).toBeInTheDocument();
    });

    it("should show creating state while submitting a new note", () => {
        renderComponent(false, true);

        expect(screen.getByText("Creating...")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Create note" })
        ).toBeDisabled();
    });

    it("should show saving state while submitting an existing note", () => {
        renderComponent(true, true);

        expect(screen.getByText("Saving...")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Save changes" })
        ).toBeDisabled();
    });

    it("should render navigation links", () => {
        renderComponent();

        const links = screen.getAllByRole("link");

        expect(
            links.some((link) => link.getAttribute("href") === "/dashboard")
        ).toBe(true);
    });
});