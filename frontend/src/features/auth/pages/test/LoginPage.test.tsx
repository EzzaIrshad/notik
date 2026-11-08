import { jest } from "@jest/globals";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { loginSchema } from "../../schemas/auth.schema";

type LoginMutationPayload = {
    email: string;
    password: string;
};

type LoginMutationOptions = {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
};

type LoginMutationCall = [LoginMutationPayload, LoginMutationOptions];

const mockNavigate = jest.fn<(to: string, options?: { replace?: boolean }) => void>();
const mockMutate = jest.fn<
    (payload: LoginMutationPayload, options: LoginMutationOptions) => void
>();


const getLastLoginMutationCall = (): LoginMutationCall => {
    const call = mockMutate.mock.calls[0];

    if (!call) {
        throw new Error("Expected login mutation to be called");
    }

    return call as LoginMutationCall;
};

let mockIsPending = false;

jest.unstable_mockModule("react-router-dom", () => {
    const actual = jest.requireActual<typeof import("react-router-dom")>(
        "react-router-dom"
    );

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

jest.unstable_mockModule("../../hooks/useLogin", () => ({
    useLogin: () => ({
        mutate: mockMutate,
        isPending: mockIsPending,
    }),
}));

const { default: LoginPage } = await import("../LoginPage");

const renderLoginPage = () => {
    return render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );
};

describe("LoginPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockIsPending = false;
    });

    it("should render the login form", () => {
        renderLoginPage();

        expect(
            screen.getByRole("heading", { name: "Welcome Back" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("textbox", { name: /email/i })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Login" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: "Create Account" })
        ).toHaveAttribute("href", "/register");
    });

    it("should show validation errors when submitted with empty fields", async () => {
        const user = userEvent.setup();

        renderLoginPage();

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        expect(
            await screen.findByText("Email is required.")
        ).toBeInTheDocument();

        expect(
            await screen.findByText("Password is required.")
        ).toBeInTheDocument();

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("should reject an invalid email", () => {
        const result = loginSchema.safeParse({
            email: "invalid-email",
            password: "password123",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Please enter a valid email address"
            );
        }
    })

    it("should submit valid credentials", async () => {
        const user = userEvent.setup();

        renderLoginPage();

        await user.type(
            screen.getByRole("textbox", { name: /email/i }),
            "john@example.com"
        );

        await user.type(
            screen.getByPlaceholderText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledTimes(1);
        });

        const [credentials, options] = getLastLoginMutationCall();

        expect(credentials).toEqual({
            email: "john@example.com",
            password: "password123",
        });

        expect(options).toEqual(
            expect.objectContaining({
                onSuccess: expect.any(Function),
            })
        );
    });

    it("should navigate to the dashboard and reset the form after successful login", async () => {
        const user = userEvent.setup();

        renderLoginPage();

        const emailInput = screen.getByRole("textbox", {
            name: /email/i,
        });

        const passwordInput = screen.getByPlaceholderText("Password");

        await user.type(emailInput, "john@example.com");
        await user.type(passwordInput, "password123");

        await user.click(
            screen.getByRole("button", { name: "Login" })
        );

        const [, options] = getLastLoginMutationCall();

        await act(async () => {
            options.onSuccess?.();
        });

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

        await waitFor(() => {
            expect(emailInput).toHaveValue("");
            expect(passwordInput).toHaveValue("");
        });
    });

    it("should toggle password visibility", async () => {
        const user = userEvent.setup();

        renderLoginPage();

        const passwordInput = screen.getByPlaceholderText("Password");

        expect(passwordInput).toHaveAttribute("type", "password");

        await user.click(
            screen.getByRole("button", { name: "Show password" })
        );

        expect(passwordInput).toHaveAttribute("type", "text");

        expect(
            screen.getByRole("button", { name: "Hide password" })
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Hide password" })
        );

        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should show loading state while login is pending", () => {
        mockIsPending = true;

        renderLoginPage();

        expect(
            screen.getByRole("button", { name: "Logging in..." })
        ).toBeDisabled();

        expect(
            screen.getByText("Logging in...")
        ).toBeInTheDocument();
    });
});