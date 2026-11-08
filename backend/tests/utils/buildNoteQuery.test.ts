import { expect } from "chai";
import { buildNoteQuery } from "../../src/utils/buildNoteQuery.js";

describe("buildNoteQuery", () => {
    it("should restrict the query to the provided user", ()=>{
        const result = buildNoteQuery({ userId: "user-123" })

        expect(result.filter).to.deep.equal({ userId: "user-123" })
        expect(result.sortOption).to.deep.equal({
            isPinned: -1,
            updatedAt: -1
        })
    });

    it("should create a case-insensitive search on title, content and tags", ()=>{
        const result = buildNoteQuery({
            userId: "user-123",
            search: "project",
        })

        expect(result.filter.userId).to.equal("user-123")
        expect(result.filter.$or).to.deep.equal([
            {
                title: {
                    $regex: "project",
                    $options: "i"
                }
            },
            {
                content: {
                    $regex: "project",
                    $options: "i"
                },
            },
            {
                tags: {
                    $regex: "project",
                    $options: "i"
                },
            }
        ])
    });

    it("should escape regular expression characters in search input", ()=>{
        const result = buildNoteQuery({
            userId: "user-123",
            search: "hello.*world"
        });

        const searchConditions = result.filter.$or as Array<{
            title: {
                $regex: string;
                $options: string
            };
            content?: never;
            tags?: never
        }>

        expect(searchConditions[0].title.$regex).to.equal( "hello\\.\\*world" );
    })

    it("should filter for pinned notes when isPinned is true", ()=> {
        const result = buildNoteQuery({
            userId: "user-123",
            isPinned: "true"
        })

        expect(result.filter).to.deep.include({
            userId: "user-123",
            isPinned: true
        })
    });

    it("should filter for unpinned notes when isPinned is false", ()=>{
        const result = buildNoteQuery({
            userId: "user-123",
            isPinned: "false"
        })

        expect(result.filter).to.deep.include({
            userId: "user-123",
            isPinned: false
        })
    });

    it("should sort notes by pinned status and updated date bydefault", () =>{
        const result = buildNoteQuery({ userId: "user-123" })

        expect(result.sortOption).to.deep.equal({
            isPinned: -1,
            updatedAt: -1
        })
    })

    it("should sort notes by pinned status and creation date when requested", ()=>{
        const result = buildNoteQuery({
            userId: "user-123",
            sort: "createdAt"
        })

        expect(result.sortOption).to.deep.equal({
            isPinned: -1,
            createdAt: -1
        })
    });

    it("should support combining search, pinned filter and created-date sorting", ()=> {
        const result = buildNoteQuery({
            userId: "user-123",
            search: "meeting",
            isPinned: "true",
            sort: "createdAt"
        });

        expect(result.filter.userId).to.equal("user-123")
        expect(result.filter.isPinned).to.equal(true)
        expect(result.filter.$or).to.exist;

        expect(result.sortOption).to.deep.equal({
            isPinned: -1,
            createdAt: -1
        })
    })
});