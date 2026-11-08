import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { DashboardTab } from "../../layouts/DashboardLayout";
import type { ReactNode } from "react";

const mockNavigate = jest.fn<
    (to: string, options?: { replace?: boolean }) => void
>();

const mockSetTab = jest.fn<(tab: DashboardTab) => void>();

const mockSetTheme = jest.fn<(theme: "light" | "dark" | "system") => void>();

type LogoutMutationOptions = {
    onSuccess?: () => void;
};

const mockMutate = jest.fn<
    (
        variables: undefined,
        options?: LogoutMutationOptions
    ) => void
>();

let mockIsLoading = false;
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

jest.unstable_mockModule("@/app/providers/ThemeProvider", () => ({
    useTheme: () => ({
        theme: mockTheme,
        setTheme: mockSetTheme,
    }),
}));

let mockUser:
    | {
          fullName: string;
          email: string;
      }
    | undefined = {
    fullName: "John Doe",
    email: "john@example.com",
};

jest.unstable_mockModule("@/features/auth/hooks/useGetUser", () => ({
        useGetUser: () => ({
            data: mockUser
                ? {
                      data: mockUser,
                  }
                : undefined,
            isLoading: mockIsLoading,
        }),
    })
);

jest.unstable_mockModule( "@/features/auth/hooks/useLogout", () => ({
        useLogout: () => ({
            mutate: mockMutate,
            isPending: mockIsPending,
        }),
    })
);

jest.unstable_mockModule("@/shared/components/ui/tabs", () => {
    const Tabs = ({
        children,
        value,
        onValueChange,
    }: {
        children: ReactNode;
        value: string;
        onValueChange: (value: string) => void;
    }) => (
        <div data-testid="tabs">
            <span data-testid="tabs-value">{value}</span>

            <button
                type="button"
                data-testid="change-theme"
                onClick={() => onValueChange("dark")}
            >
                Change theme
            </button>

            {children}
        </div>
    );

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
        <button
            type="button"
            role="tab"
            data-value={value}
        >
            {children}
        </button>
    );

    return {
        Tabs,
        TabsList,
        TabsTrigger,
    };
});

jest.unstable_mockModule("@/shared/components/ui/dropdown-menu", () => {
        const DropdownMenu = ({
            children,
        }: {
            children: ReactNode;
        }) => (
            <div data-testid="dropdown-menu">
                {children}
            </div>
        );

        const DropdownMenuTrigger = ({
            children,
        }: {
            children: ReactNode;
        }) => (
            <button
                type="button"
                data-testid="account-trigger"
            >
                {children}
            </button>
        );

        const DropdownMenuContent = ({
            children,
        }: {
            children: ReactNode;
        }) => (
            <div
                role="menu"
                data-testid="dropdown-content"
            >
                {children}
            </div>
        );

        const DropdownMenuGroup = ({
            children,
        }: {
            children: ReactNode;
        }) => <div>{children}</div>;

        const DropdownMenuItem = ({
            children,
            onClick,
            disabled,
        }: {
            children: ReactNode;
            onClick?: () => void;
            disabled?: boolean;
        }) => (
            <button
                type="button"
                role="menuitem"
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </button>
        );

        const DropdownMenuSeparator = () => (
            <div role="separator" />
        );

        return {
            DropdownMenu,
            DropdownMenuContent,
            DropdownMenuGroup,
            DropdownMenuItem,
            DropdownMenuSeparator,
            DropdownMenuTrigger,
        };
    }
);

jest.unstable_mockModule("@/shared/components/ui/dialog", () => {
        const Dialog = ({
            children,
        }: {
            children: ReactNode;
        }) => <div data-testid="dialog">{children}</div>;

        const DialogContent = ({
            children,
        }: {
            children: ReactNode;
        }) => (
            <div
                role="dialog"
                data-testid="dialog-content"
            >
                {children}
            </div>
        );

        return {
            Dialog,
            DialogContent,
        };
    }
);

jest.unstable_mockModule("../UserProfile", () => ({
    default: ({
        onOpenChange,
    }: {
        onOpenChange: (open: boolean) => void;
    }) => (
        <div data-testid="user-profile">
            <span>User Profile</span>

            <button
                type="button"
                onClick={() => onOpenChange(false)}
            >
                Close profile
            </button>
        </div>
    ),
}));

let mockTheme: "light" | "dark" | "system" = "light";

jest.unstable_mockModule(
    "@/app/providers/ThemeProvider",
    () => ({
        useTheme: () => ({
            theme: mockTheme,
            setTheme: mockSetTheme,
        }),
    })
);

const { default: AccountDropdown } = await import("../AccountDropdown");

const renderAccountDropdown = () => {
    return render(
        <MemoryRouter>
            <AccountDropdown setTab={mockSetTab} />
        </MemoryRouter>
    );
};

describe("AccountDropdown", () => {
    beforeEach(() => {
    jest.clearAllMocks();

    mockIsLoading = false;
    mockIsPending = false;

    mockTheme = "light";

    mockUser = {
        fullName: "John Doe",
        email: "john@example.com",
    };
});

it("should render the account trigger", () => {
    renderAccountDropdown();

    expect(
        screen.getByRole("button", {
            name: "User Account",
        })
    ).toBeInTheDocument();
});

it("should show user information", () => {
    renderAccountDropdown();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
        screen.getByText("john@example.com")
    ).toBeInTheDocument();

    expect(screen.getByText("JD")).toBeInTheDocument();
});

it("should show loading state while user data is loading", () => {
    mockIsLoading = true;

    renderAccountDropdown();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("should change the theme", async () => {
    const user = userEvent.setup();

    renderAccountDropdown();

    await user.click(
        screen.getByTestId("change-theme")
    );

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
});

it("should open the profile dialog", async () => {
    const user = userEvent.setup();

    renderAccountDropdown();

    await user.click(
        screen.getByRole("menuitem", {
            name: /profile/i,
        })
    );

    expect(
        screen.getByTestId("user-profile")
    ).toBeInTheDocument();
});

it("should switch to the pinned notes tab", async () => {
    const user = userEvent.setup();

    renderAccountDropdown();

    await user.click(
        screen.getByRole("menuitem", {
            name: /pinned notes/i,
        })
    );

    expect(mockSetTab).toHaveBeenCalledWith("pinned");
});

it("should call logout mutation", async () => {
    const user = userEvent.setup();

    renderAccountDropdown();

    await user.click(
        screen.getByRole("menuitem", {
            name: /^logout$/i,
        })
    );

    expect(mockMutate).toHaveBeenCalledTimes(1);
});

it("should navigate to login after successful logout", async () => {
    const user = userEvent.setup();

    renderAccountDropdown();

    await user.click(
        screen.getByRole("menuitem", {
            name: /^logout$/i,
        })
    );

    const [, options] = mockMutate.mock.calls[0];

    options?.onSuccess?.();

    expect(mockNavigate).toHaveBeenCalledWith(
        "/login",
        { replace: true }
    );
});

it("should show logging out state while logout is pending", () => {
    mockIsPending = true;

    renderAccountDropdown();

    expect(
        screen.getByRole("menuitem", {
            name: /logging out/i,
        })
    ).toBeDisabled();

    expect(
        screen.getByText("Logging out...")
    ).toBeInTheDocument();
});
});