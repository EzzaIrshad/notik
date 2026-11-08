import { expect } from "chai";
import sinon from "sinon";
import type { NextFunction, Request, Response } from "express";

import { validateObjectId } from "../../src/middleware/validateObjectId.js";

describe("validateObjectId Middleware", ()=>{
    const createMockResponse = ()=>{
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        }

        return res as unknown as Response;
    }

    afterEach(() => {
        sinon.restore();
    })

    it("should continue when the parameter contains a valid ObjectId", () =>{
        const req = {
            params: { id: "507f1f77bcf86cd799439011" }
        } as unknown as Request;

        const res = createMockResponse()
        const next = sinon.stub();

        const middleware = validateObjectId("id")

        middleware(req, res, next as unknown as NextFunction);

        expect(next.calledOnce).to.equal(true)
        expect((res.status as sinon.SinonStub).called).to.equal(false)
    })

    it("should return 400 when the parameter contains a invalid ObjectId", ()=> {
        const req = {
            params: { id: "not-a-valid-object-id" }
        } as unknown as Request;

        const res = createMockResponse();
        const next = sinon.stub();

        const middleware = validateObjectId("id")

        middleware(req, res, next as unknown as NextFunction);

        expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true)
        expect(
            (res.json as sinon.SinonStub).calledWith({
                success: false,
                message: "Invalid note ID."
            })
        ).to.equal(true)

        expect(next.called).to.equal(false);
    })

    it("should use the specified parameter name", () =>{
        const req = {
            params: { noteId: "507f1f77bcf86cd799439011" },
        } as unknown as Request;

        const res = createMockResponse();
        const next = sinon.stub();

        const middleware = validateObjectId("noteId")
        middleware(req, res, next as unknown as NextFunction)

        expect(next.calledOnce).to.equal(true);
        expect((res.status as sinon.SinonStub).notCalled).to.equal(true);
    })
});