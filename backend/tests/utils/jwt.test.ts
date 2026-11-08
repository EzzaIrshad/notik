import { expect } from "chai";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../src/utils/jwt.js";

describe("JWT Utilities", ()=>{
    const user = {
        userId: "user-123",
        email: "test@example.com"
    };

    describe("generateToken", ()=>{
        it("should generate a token for a user", () => {
            const token = generateToken(user);

            expect(token).to.be.a("string");
            expect(token.length).to.be.greaterThan(0);
        });
    });

    describe("verifyToken", ()=>{
        it("should return the user payload for a valid token", () => {
            const token = generateToken(user);

            const decoded = verifyToken(token);

            expect(decoded.userId).to.equal(user.userId);
            expect(decoded.email).to.equal(user.email);
        });

        it("should throw a JWT error for an invalid token", () => {
            expect(() => verifyToken("invalid-token")).to.throw(jwt.JsonWebTokenError);
        });

        it("should throw a JWT eror for a modified token", () => {
            const token = generateToken(user);
            const modifiedToken = `${token}invalid`;

            expect(() => verifyToken(modifiedToken)).to.throw(jwt.JsonWebTokenError)
        });
    })
})