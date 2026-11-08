import { expect } from "chai";
import { describe, it, afterEach } from "mocha";
import sinon from "sinon";
import bcrypt from "bcrypt";
import logger from "../../src/config/logger.js";
import { hashPassword, matchPassword } from "../../src/utils/hash.js";

describe("Password Hash Utilities", () => {
    const password = "testPassword12!3";

    afterEach(() => {
        sinon.restore();
    });

    describe("hashPassword", () => {
        it("should return a hashed password", async () => {
            const hashedPassword = await hashPassword(password);

            expect(hashedPassword).to.be.a("string");
            expect(hashedPassword).to.not.equal(password);
        });

        it("should generate different hashes for the same password", async () => {
            const firstHash = await hashPassword(password);
            const secondHash = await hashPassword(password);

            expect(firstHash).to.not.equal(secondHash);
        });

        it("should log the error message and rethrow when an Error is thrown", async () => {
            const error = new Error("Hashing failed");

            sinon.stub(bcrypt, "genSalt").rejects(error);

            const loggerStub = sinon.stub(logger, "error");

            try {
                await hashPassword(password);
                expect.fail("Expected hashPassword to throw");
            } catch (thrownError) {
                expect(thrownError).to.equal(error);

                expect(
                    loggerStub.calledOnceWithExactly(
                        "Password hash failed: Hashing failed"
                    )
                ).to.equal(true);
            }
        });
    });

    describe("matchPassword", () => {
        it("should return true when the password matches the hash", async () => {
            const hashedPassword = await hashPassword(password);

            const result = await matchPassword(password, hashedPassword);

            expect(result).to.equal(true);
        });

        it("should return false when the password does not match the hash", async () => {
            const hashedPassword = await hashPassword(password);

            const result = await matchPassword(
                "WrongPassword12",
                hashedPassword
            );

            expect(result).to.equal(false);
        });
    });
});