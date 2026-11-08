import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../../src/controllers/note.controller.js";
import Note from "../../src/models/note.model.js";
import type { Request, Response } from "express";
import { describe, it } from "mocha";
import sinonChai from "sinon-chai";
import { expect } from "chai";
import * as chai from 'chai';
import sinon from "sinon";

chai.use(sinonChai);

describe("Notes Controller", () => {
    afterEach(() => {
        sinon.restore();
    })

    const createMockResponse = () => {
        const status = sinon.stub();
        const json = sinon.stub();

        const res = {
            status,
            json,
        } as unknown as Response;

        status.returns(res);
        json.returns(res);

        return res;
    };

    const userId = "user-123";
    const noteId = "note-123";

    const existingNote = {
        _id: noteId,
        title: "Test Note",
        content: "This is a test note.",
        userId,
        isPinned: false,
        tags: ["testing"]
    }

    describe("getNote", () => {
        it("should return a note belonging to the autheniticated user", async () => {
            const req = {
                params: { id: noteId },
                user: { userId },
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOne").resolves(existingNote as never)

            await getNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true);
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true)
            expect(responseBody.message).to.equal("Note retrieved successfully.");
            expect(responseBody.data).to.equal(existingNote)
        });

        it("should return 404 when note does not exist", async () => {
            const req = {
                params: { id: noteId },
                user: { userId },
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOne").resolves(null);

            await getNote(req, res)

            expect((res.status as sinon.SinonStub).calledWith(404)).to.equal(true);
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Note not found." })
            ).to.equal(true);
        })

        it("should return 500 when retrieving the note fails", async () => {
            const req = {
                params: { id: noteId },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOne").rejects(new Error("Database failure"))

            await getNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Internal server error." }),
            ).to.equal(true)
        })
    });

    describe("createNote", () => {
        it("should create and return a new note", async () => {
            const req = {
                body: {
                    title: "New Note",
                    content: "Note content",
                    isPinned: false,
                    tags: ["work"],
                },
                user: {
                    userId
                }
            } as unknown as Request;

            const res = createMockResponse();

            const savedNote = {
                _id: noteId,
                title: "New Note",
                content: "Note content",
                userId,
                isPinned: false,
                tags: ["work"]
            }

            sinon.stub(Note.prototype, "save").resolves(savedNote as never);

            await createNote(req, res)

            expect((res.status as sinon.SinonStub).calledWith(201)).to.equal(true)
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true)
            expect(responseBody.message).to.equal("Note created successfully.")
            expect(responseBody.data).to.equal(savedNote);
        })

        it("should reject creation when the note data is invalid", async () => {
            const req = {
                body: {
                    title: "",
                    content: "Invalid note"
                },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            await createNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.message).to.equal("Failed to create note");
            expect(responseBody.errors).to.exist
        })

        it("should return 500 when saving the note fail", async () => {
            const req = {
                body: {
                    title: "New Note",
                    content: "Note content"
                },
                user: { userId }
            } as unknown as Request

            const res = createMockResponse();

            sinon.stub(Note.prototype, "save").rejects(new Error("Database failure"));

            await createNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Internal server error" })
            ).to.equal(true);
        })
    });

    describe("updateNote", () => {
        it("should update an existing note", async () => {
            const req = {
                params: { id: noteId },
                body: {
                    title: "Updated note",
                    content: "Updated content"
                },
                user: { userId },
            } as unknown as Request;

            const res = createMockResponse();

            const updatedNote = {
                ...existingNote,
                title: "Updated note",
                content: "Updated content"
            }

            sinon.stub(Note, "findOneAndUpdate")
                .resolves(updatedNote as never);

            await updateNote(req, res)

            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true)
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true)

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true)
            expect(responseBody.message).to.equal("Note updated successfully.")
            expect(responseBody.data).to.equal(updatedNote);
        });

        it("should return 404 when the note to update does not exist", async () => {
            const req = {
                params: { id: noteId },
                body: { title: "Updated Note" },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOneAndUpdate").resolves(null)

            await updateNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(404)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Note not found." })
            ).to.equal(true);
        })

        it("should reject an invalid update payload", async () => {
            const req = {
                params: { id: noteId },
                body: { title: "" },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            await updateNote(req, res)

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0]
            expect(responseBody.message).to.equal("Failed to update note.");
            expect(responseBody.errors).to.exist
        })

        it("should return 500 when updating the note fails", async () => {
            const req = {
                params: { id: noteId },
                body: { title: "Updated Note" },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOneAndUpdate")
                .rejects(new Error("Database failure"));

            await updateNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Internal server error." }),
            ).to.equal(true);
        })
    })

    describe("deleteNote", () => {
        it("should delete an existing note", async () => {
            const req = {
                params: { id: noteId },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOneAndDelete").resolves(existingNote as never)

            await deleteNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({
                    success: true,
                    message: "Note deleted successfully."
                })
            ).to.equal(true)
        })

        it("should return 404 when the note to delete does not exist", async () => {
            const req = {
                params: { id: noteId },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOneAndDelete").resolves(null);

            await deleteNote(req, res);

            expect((res.status as sinon.SinonStub).calledWith(404)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Note not found." })
            ).to.equal(true)
        });

        it("should return 500 when deleting the note fails", async () => {
            const req = {
                params: { id: noteId },
                user: { userId }
            } as unknown as Request;

            const res = createMockResponse();

            sinon.stub(Note, "findOneAndDelete")
                .rejects(new Error("Database failure"))

            await deleteNote(req, res)

            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true)
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Internal server error." })
            ).to.equal(true)
        })
    })

    describe("getAllNotes", () => {
        it("should return all notes for the authenticated user", async () => {
            const req = {
                query: {},
                user: { userId: "user-123" },
            } as unknown as Request;

            const res = createMockResponse();

            const notes = [
                {
                    _id: "note-1",
                    title: "First Note",
                    content: "First note content",
                    userId: "user-123",
                    isPinned: true,
                    tags: ["work"]
                },
                {
                    _id: "note-2",
                    title: "Second Note",
                    content: "Second note content",
                    userId: "user-123",
                    isPinned: false,
                    tags: ["personal"]
                }
            ]

            const sortStub = sinon.stub().resolves(notes)

            sinon.stub(Note, "find").returns({ sort: sortStub } as never);

            await getAllNotes(req, res)

            expect((res.status as sinon.SinonStub).calledWith(200)).to.equal(true)
            expect((res.json as sinon.SinonStub).calledOnce).to.equal(true)

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0];

            expect(responseBody.success).to.equal(true);
            expect(responseBody.message).to.equal("Notes retrieved successfully.");
            expect(responseBody.data).to.equal(notes)
        })

        it("should apply search, pinned filter and sorting options", async () => {
            const req = {
                query: {
                    search: "project",
                    isPinned: "true",
                    sort: "createdAt"
                },
                user: { userId: "user-123" }
            } as unknown as Request;

            const res = createMockResponse()

            const notes = [{
                _id: "note-1",
                title: "Project Notes",
                content: "Project information",
                userId: "user-123",
                isPinned: true,
                tags: ["project"]
            }]

            const sortStub = sinon.stub().resolves(notes)
            const findStub = sinon.stub(Note, "find").returns({ sort: sortStub } as never)

            await getAllNotes(req, res);

            expect(findStub.calledOnce).to.equal(true)

            const filter = findStub.firstCall.args[0] as {
                userId?: string;
                isPinned?: boolean;
                $or?: unknown
            }

            expect(filter.userId).to.equal("user-123");
            expect(filter.isPinned).to.equal(true);
            expect(filter.$or).to.exist;

            expect(sortStub.calledOnce).to.equal(true)

            expect(sortStub.firstCall.args[0]).to.deep.equal({
                isPinned: -1,
                createdAt: -1
            })

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0]
            expect(responseBody.data).to.equal(notes);
        });

        it("should return 400 when query parameters are invalid", async () => {
            const req = {
                query: { isPinned: "invalid-value" },
                user: { userId: "user-123" },
            } as unknown as Request;

            const res = createMockResponse()

            await getAllNotes(req, res)

            expect((res.status as sinon.SinonStub).calledWith(400)).to.equal(true);

            const responseBody = (res.json as sinon.SinonStub).firstCall.args[0]
            expect(responseBody.message).to.equal("Invalid query parameters.");
            expect(responseBody.errors).to.exist
        })

        it("should return 500 when retrieving notes fails", async () => {
            const req = {
                query: {},
                user: { userId: "user-123" }
            } as unknown as Request;

            const res = createMockResponse()

            const sortStub = sinon.stub().rejects(new Error("Database failure"));

            sinon.stub(Note, "find").returns({ sort: sortStub } as never)

            await getAllNotes(req, res)
            expect((res.status as sinon.SinonStub).calledWith(500)).to.equal(true);
            expect(
                (res.json as sinon.SinonStub).calledWith({ message: "Internal server error." })
            ).to.equal(true)
        })
    });
})