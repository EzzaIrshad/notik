import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

const mockSetSort = jest.fn<
    (value: "createdAt" | "updatedAt") => void
>();

jest.unstable_mockModule(
    "@/shared/components/ui/dropdown-menu",
    () => {
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
            render: trigger,
        }: {
            render: ReactNode;
        }) => <>{trigger}</>;

        const DropdownMenuContent = ({
            children,
        }: {
            children: ReactNode;
        }) => (
            <div role="menu" data-testid="dropdown-content">
                {children}
            </div>
        );

        const DropdownMenuGroup = ({
            children,
        }: {
            children: ReactNode;
        }) => <div>{children}</div>;

        const DropdownMenuLabel = ({
            children,
        }: {
            children: ReactNode;
        }) => <div>{children}</div>;

        const DropdownMenuRadioGroup = ({
            children,
            value,
            onValueChange,
        }: {
            children: ReactNode;
            value: string;
            onValueChange: (value: string) => void;
        }) => (
            <div
                role="radiogroup"
                data-value={value}
                data-testid="sort-radio-group"
            >
                <button
                    type="button"
                    data-testid="select-createdAt"
                    onClick={() => onValueChange("createdAt")}
                >
                    Select newest
                </button>

                <button
                    type="button"
                    data-testid="select-updatedAt"
                    onClick={() => onValueChange("updatedAt")}
                >
                    Select recently updated
                </button>

                {children}
            </div>
        );

        const DropdownMenuRadioItem = ({
            children,
            value,
        }: {
            children: ReactNode;
            value: string;
        }) => (
            <div
                role="radio"
                aria-checked={false}
                data-value={value}
            >
                {children}
            </div>
        );

        return {
            DropdownMenu,
            DropdownMenuLabel,
            DropdownMenuGroup,
            DropdownMenuContent,
            DropdownMenuTrigger,
            DropdownMenuRadioItem,
            DropdownMenuRadioGroup,
        };
    }
);

const { default: SortMenu } = await import("../SortMenu");

describe("SortMenu", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render the sort trigger", () => {
        render(
            <SortMenu
                sort="createdAt"
                setSort={mockSetSort}
            />
        );

        expect(
            screen.getByRole("button", {
                name: /sort/i,
            })
        ).toBeInTheDocument();
    });

    it("should render the sort options", () => {
        render(
            <SortMenu
                sort="createdAt"
                setSort={mockSetSort}
            />
        );

        expect(
            screen.getByText("Sort notes")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("radio", {
                name: "Newest",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("radio", {
                name: "Recently updated",
            })
        ).toBeInTheDocument();
    });

    it("should use createdAt as the current sort value", () => {
        render(
            <SortMenu
                sort="createdAt"
                setSort={mockSetSort}
            />
        );

        expect(
            screen.getByTestId("sort-radio-group")
        ).toHaveAttribute(
            "data-value",
            "createdAt"
        );
    });

    it("should use updatedAt as the current sort value", () => {
        render(
            <SortMenu
                sort="updatedAt"
                setSort={mockSetSort}
            />
        );

        expect(
            screen.getByTestId("sort-radio-group")
        ).toHaveAttribute(
            "data-value",
            "updatedAt"
        );
    });

    it("should call setSort with createdAt", async () => {
        const user = userEvent.setup();

        render(
            <SortMenu
                sort="updatedAt"
                setSort={mockSetSort}
            />
        );

        await user.click(
            screen.getByTestId("select-createdAt")
        );

        expect(mockSetSort).toHaveBeenCalledWith(
            "createdAt"
        );
    });

    it("should call setSort with updatedAt", async () => {
        const user = userEvent.setup();

        render(
            <SortMenu
                sort="createdAt"
                setSort={mockSetSort}
            />
        );

        await user.click(
            screen.getByTestId("select-updatedAt")
        );

        expect(mockSetSort).toHaveBeenCalledWith(
            "updatedAt"
        );
    });
});