import { render, screen } from "@testing-library/react";
import AuthHero from "../AuthHero";

describe("AuthHero", () => {
    it("should render the welcome heading", () => {
        render(<AuthHero />);

        expect(
            screen.getByRole("heading", { name: /welcome to notik/i })
        ).toBeInTheDocument();
    });

    it("should render the introduction text", () => {
        render(<AuthHero />);

        expect(
            screen.getByText(
                /capture ideas beautifully — a calm, colorful home for your notes/i
            )
        ).toBeInTheDocument();
    });

    it("should render the hero illustration", () => {
        render(<AuthHero />);

        expect(
            screen.getByAltText("Notik hero illustration")
        ).toBeInTheDocument();
    });
});