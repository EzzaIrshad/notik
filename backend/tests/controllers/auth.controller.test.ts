import { registerUser, loginUser, getCurrentUser, logoutUser } from "../../src/controllers/auth.controller.js";
import { hashPassword } from "../../src/utils/hash.js";
import User from "../../src/models/user.model.js";
import type { Request, Response } from "express";
import { describe, it } from "mocha";
import sinonChai from "sinon-chai";
import { expect } from "chai";
import * as chai from 'chai';
import sinon from "sinon";

chai.use(sinonChai);

describe("Authentication Controller", () => {
    afterEach(() => {
        sinon.restore();
    })

    const createMockResponse = () => {
        const res = {
            status: sinon.stub(),
            json: sinon.stub(),
            cookie: sinon.stub(),
            clearCookie: sinon.stub()
        } as unknown as Response;

        (res.status as sinon.SinonStub).returns(res);
        (res.json as sinon.SinonStub).returns(res);

        return res;
    }

    describe("registerUser", () => {
        it("should registe a new user successfully", async () => {
            const req = {
                body: {
                    fullName: "Test User",
                    email: "test@example.com",
                    password: "TestPassword345$"
                }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(User, "findOne").resolves(null);

            sinon.stub(User.prototype, "save").resolves();

            await registerUser(req, res)

            expect((res.status as sinon.SinonStub).calledWith(201)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true);
            expect(responseBody.message).to.equal("Registered successfully.");
            expect(responseBody.data.user.fullName).to.equal("Test User");
            expect(responseBody.data.user.email).to.equal("test@example.com");
        })

        it("should reject registration when the email already exists", async () => {
            const req = {
                body: {
                    fullName: "Existing User",
                    email: "existing@example.com",
                    password: "Password13!",
                },
            } as Request;

            const res = createMockResponse();

            sinon.stub(User, "findOne").resolves({
                _id: "existing-user-id",
                email: "existing@example.com",
            } as never);

            await registerUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledWith({
                message: "That email is already in use!",
            })).to.equal(true);
        })

        it("should reject registration when the request data is invalid", async () => {
            const req = {
                body: {
                    fullName: "",
                    email: "not-an-email",
                    password: "short",
                },
            } as Request;

            const res = createMockResponse();

            await registerUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.message).to.equal("Validation failed");
            expect(responseBody.errors).to.exist;
        });

    })

    describe("loginUser", () => {
        it("should authenticate a user with valid credentials", async () => {
            const password = "TestPassword345$";
            const hashedPassword = await hashPassword(password);

            const req = {
                body: {
                    email: "test@example.com",
                    password,
                }
            } as Request;

            const res = createMockResponse();

            sinon.stub(User, "findOne").resolves({
                _id: "user-123",
                fullName: "Test User",
                email: "test@example.com",
                password: hashedPassword,
            } as never);

            await loginUser(req, res);

            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true);
            expect(responseBody.message).to.equal("Logged in successfully.");
            expect(responseBody.data.user.fullName).to.equal("Test User");
            expect(responseBody.data.user.email).to.equal("test@example.com");

            expect((res.cookie as sinon.SinonStub).calledOnce).to.equal(true)
        })

        it("should reject login when the email does not exist", async () => {
            const req = {
                body: {
                    email: "unknown@example.com",
                    password: "Password13!",
                },
            } as Request;

            const res = createMockResponse();

            sinon.stub(User, "findOne").resolves(null);

            await loginUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(401)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledWith({
                message: "Invalid email or password.",
            })).to.equal(true);
        })

        it("should reject login when the password is incorrect", async () => {
            const hashedPassword = await hashPassword("CorrectPasswod123!");
            const req = {
                body: {
                    email: "test@example.com",
                    password: "WrongPassword123!",
                },
            } as Request;

            const res = createMockResponse();

            sinon.stub(User, "findOne").resolves({
                _id: "user-123",
                fullName: "Test User",
                email: "test@example.com",
                password: hashedPassword,
            } as never);

            await loginUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(401)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledWith({
                message: "Invalid email or password.",
            })).to.equal(true);
        })

        it("should reject login when the request data is invalid", async () => {
            const req = {
                body: {
                    email: "wrong-email",
                    password: "",
                },
            } as Request;

            const res = createMockResponse();

            await loginUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);
            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.message).to.equal("Validation failed")
            expect(responseBody.errors).to.exist;
        });
    })

    describe("getCurrentUser", () => {
        it("should return the authenticated user's detail", async () => {
            const req = {
                user: {
                    userId: "user-123",
                },
            } as unknown as Request;

            const res = createMockResponse();

            const user = {
                _id: "user-123",
                fullName: "Test User",
                email: "test@example.com",
                createdAt: new Date(),
            }

            const selectStub = sinon.stub().resolves(user);
            sinon.stub(User, "findById").returns({
                select: selectStub,
            } as never);

            await getCurrentUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true);
            expect(responseBody.message).to.equal("User retrieved successfully.");
            expect(responseBody.data).to.equal(user);
        });

        it("should return 404 when the user does not exist", async () => {
            const req = {
                user: {
                    userId: "missing-user",
                },
            } as unknown as Request;

            const res = createMockResponse();
            const selectStub = sinon.stub().resolves(null);

            sinon.stub(User, "findById").returns({
                select: selectStub,
            } as never);

            await getCurrentUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(404)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledWith({
                message: "User not found.",
            })).to.equal(true);
        });

        it("should return 500 when retrieving user fails", async () => {
            const req = {
                user: {
                    userId: "user-123"
                }
            } as unknown as Request;

            const res = createMockResponse();

            const selectStub = sinon.stub().rejects(new Error("Database failure"));

            sinon.stub(User, "findById").returns({
                select: selectStub
            } as never);

            await getCurrentUser(req, res);

            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);

            expect((res.json as sinon.SinonStub).calledWith({
                message: "Internal server error."
            })).to.equal(true)
        })
    })

    describe("logoutUser", () => {
        it("should clear the authentication cookie and return a success response", () => {
            const req = {} as Request;
            const res = createMockResponse();

            logoutUser(req, res);

            expect((res.clearCookie as sinon.SinonStub).calledOnce).to.equal(true);
            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true);

            expect((res.json as sinon.SinonStub).calledWith({
                success: true,
                message: "Logged out successfully."
            })).to.equal(true);
        })
    });

})