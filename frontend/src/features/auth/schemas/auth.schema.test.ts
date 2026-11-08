import { loginSchema, registerSchema } from "./auth.schema";

describe("registerSchema", () => {
    it("should validate correct registration data", () => {
        const result = registerSchema.safeParse({
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123"
        });

        expect(result.success).toBe(true);
    });

    it("should reject an empty full name", () => {
        const result = registerSchema.safeParse({
            fullName: "",
            email: "john@example.com",
            password: "password123"
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Full name is required."
            );
        }
    });

    it("should reject a whitespace-only full name", () => {
        const result = registerSchema.safeParse({
            fullName: "   ",
            email: "john@example.com",
            password: "password123"
        });

        expect(result.success).toBe(false);
    });

    it("should reject a full name shorter than 2 characters", () => {
        const result = registerSchema.safeParse({
            fullName: "A",
            email: "john@example.com",
            password: "password123"
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Full name must be at least 2 characters."
            );
        }
    });

    it("should reject a full name longer than 50 characters", () => {
        const result = registerSchema.safeParse({
            fullName: "A".repeat(51),
            email: "john@example.com",
            password: "password123",
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty email", () => {
        const result = registerSchema.safeParse({
            fullName: "John Doe",
            email: "",
            password: "password123",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Email is required."
            );
        }
    });

    it("should reject an invalid email", () => {
        const result = registerSchema.safeParse({
            fullName: "John Doe",
            email: "invalid-email",
            password: "password123",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Please enter a valid email address"
            );
        }
    });

    it("should reject an empty password", () => {
        const result = registerSchema.safeParse({
            fullName: "John Doe",
            email: "john@example.com",
            password: "",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Password is required."
            );
        }
    });

    it("should reject a password shorter than 8 characters", () => {
        const result = registerSchema.safeParse({
            fullName: "John Doe",
            email: "john@example.com",
            password: "1234567",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Password must be at least 8 characters."
            );
        }
    });
});

describe("loginSchema", () => {
    it("should validate correct login data", () => {
        const result = loginSchema.safeParse({
            email: "john@example.com",
            password: "password123",
        });


        expect(result.success).toBe(true);
    });

    it("should reject an empty email", () => {
        const result = loginSchema.safeParse({
            email: "",
            password: "password123",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Email is required."
            );
        }
    });

    it("should reject an invalid email", () => {
        const result = loginSchema.safeParse({
            email: "invalid-email",
            password: "password123",
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty password", () => {
        const result = loginSchema.safeParse({
            email: "john@example.com",
            password: "",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Password is required."
            );
        }
    });
});