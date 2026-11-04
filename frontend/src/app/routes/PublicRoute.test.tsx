import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type UserQueryResult = {
    data?: { data?: unknown };
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
};

const mockUseGetUser = jest.fn<() => UserQueryResult>();

jest.unstable_mockModule("@/features/auth/hooks/useGetUser", () => ({
    useGetUser: mockUseGetUser,
}));

const { default: PublicRoute } = await import("./PublicRoute");

const renderPublicRoute = () =>
    render(
        <MemoryRouter initialEntries={["/register"]}>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/register" element={<div>Signup screen</div>} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

describe("PublicRoute", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the public page when the current-user endpoint returns 404", () => {
        mockUseGetUser.mockReturnValue({
            isLoading: false,
            isError: true,
            error: Object.assign(new Error("Not Found"), {
                isAxiosError: true,
                response: { status: 404 },
            }),
        });

        renderPublicRoute();

        expect(screen.getByText("Signup screen")).toBeInTheDocument();
    });

    it("shows the error message for other request failures", () => {
        mockUseGetUser.mockReturnValue({
            isLoading: false,
            isError: true,
            error: Object.assign(new Error("Server Error"), {
                isAxiosError: true,
                response: { status: 500 },
            }),
        });

        renderPublicRoute();

        expect(
            screen.getByText("Something went wrong. Please try again later.")
        ).toBeInTheDocument();
    });
});
