import { expect } from "chai";
import sinon from "sinon";
import type { Response } from "express";

import { setAuthCookie, clearAuthCookie } from "../../src/utils/cookies.js";
import { env } from "../../src/config/env.js";

describe("Authentication Cookie Utilities", ()=>{
    afterEach(() => {
        sinon.restore()
    });

    it("should set the authentication cookie with the provided token", () => {
        const res = {
            cookie: sinon.stub()
        } as unknown as Response;

        const token = "test-token";

        setAuthCookie(res, token)

        const cookieStub = res.cookie as sinon.SinonStub;

        expect(cookieStub.calledOnce).to.equal(true)
        expect(cookieStub.firstCall.args[0]).to.equal(env.COOKIE_NAME)
        expect(cookieStub.firstCall.args[1]).to.equal(token)

        expect(cookieStub.firstCall.args[2]).to.deep.include({
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
    });

    it("should clear the authentication cookie", () => {
        const res = {
            clearCookie: sinon.stub()
        } as unknown as Response;

        clearAuthCookie(res);

        const clearCookieStub = res.clearCookie as sinon.SinonStub;

        expect(clearCookieStub.calledOnce).to.equal(true)
        expect(clearCookieStub.firstCall.args[0]).to.equal(env.COOKIE_NAME)

        expect(clearCookieStub.firstCall.args[1]).to.deep.include({
            httpOnly: true,
            sameSite: "lax"
        });
    })
})