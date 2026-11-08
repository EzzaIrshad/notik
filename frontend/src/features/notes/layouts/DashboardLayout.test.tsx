import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.unstable_mockModule("../components/Navbar", () => ({
    default: ({
        search,
        onSearch,
        setTab,
    }: {
        search: string;
        onSearch: (value: string) => void;
        setTab: (tab: "all-notes" | "pinned") => void;
    }) => (
        <div>
            <input
                aria-label="Search"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />

            <button onClick={() => setTab("pinned")}>
                Pinned
            </button>
        </div>
    ),
}));

jest.unstable_mockModule("react-router-dom", () => {
    const actual = jest.requireActual<
        typeof import("react-router-dom")
    >("react-router-dom");

    return {
        ...actual,
        Outlet: ({
            context,
        }: {
            context: {
                search: string;
                tab: "all-notes" | "pinned";
            };
        }) => (
            <div>
                <span data-testid="outlet-search">
                    {context.search}
                </span>

                <span data-testid="outlet-tab">
                    {context.tab}
                </span>
            </div>
        ),
    };
});

const { default: DashboardLayout } = await import("./DashboardLayout");

describe("DashboardLayout", () => {
    it("should render the navbar and outlet", () => {
        render(
            <MemoryRouter>
                <DashboardLayout />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("textbox", { name: "Search" })
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("outlet-search")
        ).toHaveTextContent("");

        expect(
            screen.getByTestId("outlet-tab")
        ).toHaveTextContent("all-notes");
    });

    it("should provide the pinned tab when changed", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <DashboardLayout />
            </MemoryRouter>
        );

        await user.click(
            screen.getByRole("button", { name: "Pinned" })
        );

        expect(
            screen.getByTestId("outlet-tab")
        ).toHaveTextContent("pinned");
    });
});