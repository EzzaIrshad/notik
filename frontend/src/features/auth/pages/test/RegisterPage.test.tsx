import { jest } from "@jest/globals";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

type RegisterMutationPayload = {
    fullName: string;
    email: string;
    password: string;
};

type RegisterMutationOptions = {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
};

type RegisterMutationCall = [
    RegisterMutationPayload,
    RegisterMutationOptions
];

const mockNavigate = jest.fn<(to: string, options?: { replace?: boolean }) => void>();
const mockMutate = jest.fn<
    (payload: RegisterMutationPayload, options: RegisterMutationOptions) => void
>();

const getLastRegisterMutationCall = (): RegisterMutationCall => {
    const call = mockMutate.mock.calls[0];

    if (!call) {
        throw new Error("Expected register mutation to be called");
    }

    return call as RegisterMutationCall;
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

jest.unstable_mockModule("../../hooks/useRegister", () => ({
    useRegister: () => ({
        mutate: mockMutate,
        isPending: mockIsPending,
    }),
}));

const { default: RegisterPage } = await import("../RegisterPage");

const renderRegisterPage = () => {
    return render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>
    );
};

describe("RegisterPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockIsPending = false;
    });

    it("should render the registration form", () => {
        renderRegisterPage();

        expect(
            screen.getByRole("heading", {
                name: "Create your account",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("textbox", {
                name: "Full Name",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("textbox", {
                name: "Email",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Password")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Create Account",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", {
                name: "Login",
            })
        ).toHaveAttribute("href", "/login");
    });

    it("should show validation errors when submitted with empty fields", async () => {
        const user = userEvent.setup();

        renderRegisterPage();

        await user.click(
            screen.getByRole("button", {
                name: "Create Account",
            })
        );

        expect(
            await screen.findByText("Full name is required.")
        ).toBeInTheDocument();

        expect(
            await screen.findByText("Email is required.")
        ).toBeInTheDocument();

        expect(
            await screen.findByText("Password is required.")
        ).toBeInTheDocument();

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it("should submit valid registration data", async () => {
        const user = userEvent.setup();

        renderRegisterPage();

        await user.type(
            screen.getByRole("textbox", {
                name: "Full Name",
            }),
            "John Doe"
        );

        await user.type(
            screen.getByRole("textbox", {
                name: "Email",
            }),
            "john@example.com"
        );

        await user.type(
            screen.getByPlaceholderText("Password"),
            "password123"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Create Account",
            })
        );

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledTimes(1);
        });

        const [credentials, options] = getLastRegisterMutationCall();

        expect(credentials).toEqual({
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123",
        });

        expect(options).toEqual(
            expect.objectContaining({
                onSuccess: expect.any(Function),
            })
        );
    });

    it("should navigate to the dashboard and reset the form after successful registration", async () => {
        const user = userEvent.setup();

        renderRegisterPage();

        const fullNameInput = screen.getByRole("textbox", {
            name: "Full Name",
        });

        const emailInput = screen.getByRole("textbox", {
            name: "Email",
        });

        const passwordInput = screen.getByPlaceholderText("Password");

        await user.type(fullNameInput, "John Doe");
        await user.type(emailInput, "john@example.com");
        await user.type(passwordInput, "password123");

        await user.click(
            screen.getByRole("button", {
                name: "Create Account",
            })
        );

        const [, options] = getLastRegisterMutationCall();

        await act(async () => {
            options.onSuccess?.();
        });

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");

        await waitFor(() => {
            expect(fullNameInput).toHaveValue("");
            expect(emailInput).toHaveValue("");
            expect(passwordInput).toHaveValue("");
        });
    });

    it("should toggle password visibility", async () => {
        const user = userEvent.setup();

        renderRegisterPage();

        const passwordInput = screen.getByPlaceholderText("Password");

        expect(passwordInput).toHaveAttribute(
            "type",
            "password"
        );

        await user.click(
            screen.getByRole("button", {
                name: "Show password",
            })
        );

        expect(passwordInput).toHaveAttribute(
            "type",
            "text"
        );

        expect(
            screen.getByRole("button", {
                name: "Hide password",
            })
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Hide password",
            })
        );

        expect(passwordInput).toHaveAttribute(
            "type",
            "password"
        );
    });

    it("should show loading state while registration is pending", () => {
        mockIsPending = true;

        renderRegisterPage();

        expect(
            screen.getByRole("button", {
                name: "Creating...",
            })
        ).toBeDisabled();

        expect(
            screen.getByText("Creating...")
        ).toBeInTheDocument();
    });
});