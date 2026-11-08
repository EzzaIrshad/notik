import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
    it("should render the loading spinner", () => {
        render(<LoadingSpinner />);

        expect(
            screen.getByRole("status")
        ).toBeInTheDocument();
    });

    it("should provide an accessible loading message", () => {
        render(<LoadingSpinner />);

        expect(
            screen.getByText("Loading...")
        ).toBeInTheDocument();
    });

    it("should render the spinner as an SVG", () => {
        render(<LoadingSpinner />);

        const svg = document.querySelector("svg");

        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute("aria-hidden", "true");
    });
});