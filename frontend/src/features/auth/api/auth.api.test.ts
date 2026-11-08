import { jest } from "@jest/globals";

type ApiResponse = {
    data: unknown;
};

const mockedApi = {
    get: jest.fn<(url: string) => Promise<ApiResponse>>(),
    post: jest.fn<(url: string, data?: unknown) => Promise<ApiResponse>>(),
};

jest.unstable_mockModule(
    "@/shared/api/axiosInstance",
    () => ({
        api: mockedApi,
    })
);

const {
    register,
    login,
    getCurrentUser,
    logout,
} = await import("./auth.api");

describe("auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should send registration data and return the response data", async () => {
            const data = {
                fullName: "John Doe",
                email: "john@example.com",
                password: "password123",
            };

            const responseData = {
                success: true,
                message: "User registered successfully.",
            };

            mockedApi.post.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await register(data);

            expect(mockedApi.post).toHaveBeenCalledWith(
                "/auth/register",
                data
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Registration failed");

            mockedApi.post.mockRejectedValueOnce(error);

            await expect(
                register({
                    fullName: "John Doe",
                    email: "john@example.com",
                    password: "password123",
                })
            ).rejects.toThrow("Registration failed");
        });
    });

    describe("login", () => {
        it("should send login credentials and return the response data", async () => {
            const data = {
                email: "john@example.com",
                password: "password123",
            };

            const responseData = {
                success: true,
                message: "Login successful.",
            };

            mockedApi.post.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await login(data);

            expect(mockedApi.post).toHaveBeenCalledWith(
                "/auth/login",
                data
            );
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Login failed");

            mockedApi.post.mockRejectedValueOnce(error);

            await expect(
                login({
                    email: "john@example.com",
                    password: "password123",
                })
            ).rejects.toThrow("Login failed");
        });
    });

    describe("getCurrentUser", () => {
        it("should request the current user and return the response data", async () => {
            const responseData = {
                success: true,
                data: {
                    id: "user-123",
                    fullName: "John Doe",
                    email: "john@example.com",
                },
            };

            mockedApi.get.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await getCurrentUser();

            expect(mockedApi.get).toHaveBeenCalledWith("/auth/me");
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Failed to fetch user");

            mockedApi.get.mockRejectedValueOnce(error);

            await expect(getCurrentUser()).rejects.toThrow(
                "Failed to fetch user"
            );
        });
    });

    describe("logout", () => {
        it("should send a logout request and return the response data", async () => {
            const responseData = {
                success: true,
                message: "Logout successful.",
            };

            mockedApi.post.mockResolvedValueOnce({
                data: responseData,
            });

            const result = await logout();

            expect(mockedApi.post).toHaveBeenCalledWith("/auth/logout");
            expect(result).toEqual(responseData);
        });

        it("should propagate API errors", async () => {
            const error = new Error("Logout failed");

            mockedApi.post.mockRejectedValueOnce(error);

            await expect(logout()).rejects.toThrow("Logout failed");
        });
    });
});