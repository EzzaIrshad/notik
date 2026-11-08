import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../Input";

describe("Input", () => {
    it("should render the input with the provided props", () => {
        render(
            <Input
                id="email"
                icon={<span data-testid="input-icon">Icon</span>}
                iconBg="red"
                type="email"
                placeholder="Email"
                aria-label="Email"
            />
        );

        const input = screen.getByRole("textbox", { name: "Email" });

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("id", "email");
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAttribute("placeholder", "Email");

        expect(
            screen.getByTestId("input-icon")
        ).toBeInTheDocument();
    });

    it("should allow the user to type into the input", async () => {
        const user = userEvent.setup();

        render(
            <Input
                id="email"
                icon={<span>Icon</span>}
                iconBg="red"
                type="email"
                placeholder="Email"
                aria-label="Email"
            />
        );

        const input = screen.getByRole("textbox", { name: "Email" });

        await user.type(input, "john@example.com");

        expect(input).toHaveValue("john@example.com");
    });

    it("should display the error message when error is provided", () => {
        render(
            <Input
                id="email"
                icon={<span>Icon</span>}
                iconBg="red"
                type="email"
                placeholder="Email"
                aria-label="Email"
                error="Please enter a valid email address"
            />
        );

        const input = screen.getByRole("textbox", { name: "Email" });

        expect(
            screen.getByText("Please enter a valid email address")
        ).toBeInTheDocument();

        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAttribute(
            "aria-describedby",
            "email-error"
        );
    });

    it("should not display an error when no error is provided", () => {
        render(
            <Input
                id="email"
                icon={<span>Icon</span>}
                iconBg="red"
                type="email"
                placeholder="Email"
                aria-label="Email"
            />
        );

        const input = screen.getByRole("textbox", { name: "Email" });

        expect(input).toHaveAttribute("aria-invalid", "false");
        expect(input).not.toHaveAttribute("aria-describedby");

        expect(
            screen.queryByText("Please enter a valid email address")
        ).not.toBeInTheDocument();
    });

    it("should render the trailing content", () => {
        render(
            <Input
                id="password"
                icon={<span>Icon</span>}
                iconBg="red"
                type="password"
                placeholder="Password"
                aria-label="Password"
                trailing={
                    <button type="button">Show password</button>
                }
            />
        );

        expect(
            screen.getByRole("button", { name: "Show password" })
        ).toBeInTheDocument();
    });

    it("should forward the ref to the input element", () => {
        const ref = createRef<HTMLInputElement>();

        render(
            <Input
                ref={ref}
                id="email"
                icon={<span>Icon</span>}
                iconBg="red"
                type="email"
                placeholder="Email"
                aria-label="Email"
            />
        );

        expect(ref.current).toBe(
            screen.getByRole("textbox", { name: "Email" })
        );
    });
});