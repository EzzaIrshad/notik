import { render, screen } from "@testing-library/react";
import {
    MemoryRouter,
    Routes,
    Route,
} from "react-router-dom";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
    it("should render authentication content through the outlet", () => {
        render(
            <MemoryRouter initialEntries={["/auth"]}>
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route
                            index
                            element={<div>Authentication Content</div>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(
            screen.getByText("Authentication Content")
        ).toBeInTheDocument();
    });

    it("should render the authentication hero", () => {
        render(
            <MemoryRouter initialEntries={["/auth"]}>
                <Routes>
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route
                            index
                            element={<div>Authentication Content</div>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", {
                name: /welcome to notik/i,
            })
        ).toBeInTheDocument();
    });
});