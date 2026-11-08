import { expect } from "chai";
import sinon from "sinon";
import { describe, it } from "mocha";
import { protect } from "../../src/middleware/auth.middleware.js";
import { generateToken } from "../../src/utils/jwt.js";
import { NextFunction, Request, Response } from "express";
import { env } from "../../src/config/env.js";

describe("Authentication Middleware", () => {
    const createMockResponse = () => {
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        }

        return res as unknown as Response;
    }

    afterEach(() => {
        sinon.restore();
    })

    it("should reject the request when the authentication cookie is missing", () => {
        const req = { cookies: {} } as unknown as Request

        const res = createMockResponse()
        const next = sinon.stub()

        protect(req, res, next as unknown as NextFunction);
        expect((res.status as sinon.SinonStub).calledWith(401)).to.equal(true);
        expect(
            (res.json as sinon.SinonStub).calledWith({ message: "Authentication required." })
        ).to.equal(true)

        expect(next.called).to.equal(false)
    });

    it("should authenticate the request when the token is valid", () => {
        const user = {
            userId: "user-123",
            email: "test@example.com"
        }

        const token = generateToken(user);

        const req = {
            cookies: {
                [env.COOKIE_NAME]: token
            }
        } as unknown as Request;

        const res = createMockResponse();
        const next = sinon.stub();

        protect(req, res, next as unknown as NextFunction);

        expect(next.calledOnce).to.equal(true);
        expect((req as Request & { user?: typeof user }).user).to.include(user);
        expect((res.status as sinon.SinonStub).called).to.equal(false)
    })

    it("should reject the request when the token is invalid", () => {
        const req = {
            cookies: {
                [env.COOKIE_NAME]: "invalid-token"
            }
        } as unknown as Request;

        const res = createMockResponse();
        const next = sinon.stub()
        protect(req, res, next as unknown as NextFunction);

        expect((res.status as sinon.SinonStub).calledWith(401)).to.equal(true);
        expect(
            (res.json as sinon.SinonStub).calledWith({ message: "Invalid or expired token." })
        ).to.equal(true);

        expect(next.called).to.equal(false)
    });
});