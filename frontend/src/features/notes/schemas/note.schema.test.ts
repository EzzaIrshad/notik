import { createNoteSchema, updateNoteSchema } from "./note.schema";

describe("createNoteSchema", () => {
    it("should validate a valid note", () => {
        const result = createNoteSchema.safeParse({
            title: "My first note",
            content: "This is my note content.",
            tags: ["work", "important"],
            isPinned: false,
        });

        expect(result.success).toBe(true);
    });

    it("should validate a note with only a title", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
        });

        expect(result.success).toBe(true);
    });

    it("should reject a missing title", () => {
        const result = createNoteSchema.safeParse({
            content: "Some content",
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty title", () => {
        const result = createNoteSchema.safeParse({
            title: "",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Title cannot be empty."
            );
        }
    });

    it("should reject a whitespace-only title", () => {
        const result = createNoteSchema.safeParse({
            title: "   ",
        });

        expect(result.success).toBe(false);
    });

    it("should reject a title longer than 200 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "a".repeat(201),
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Title cannot exceed 200 characters."
            );
        }
    });

    it("should accept a title with exactly 200 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "a".repeat(200),
        });

        expect(result.success).toBe(true);
    });

    it("should reject content larger than 500000 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "Large note",
            content: "a".repeat(500001),
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Content is too large."
            );
        }
    });

    it("should accept content with exactly 500000 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "Large note",
            content: "a".repeat(500000),
        });

        expect(result.success).toBe(true);
    });

    it("should reject an empty tag", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: ["work", ""],
        });

        expect(result.success).toBe(false);
    });

    it("should reject a tag longer than 30 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: ["a".repeat(31)],
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Tag cannot exceed 30 characters."
            );
        }
    });

    it("should accept a tag with exactly 30 characters", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: ["a".repeat(30)],
        });

        expect(result.success).toBe(true);
    });

    it("should reject more than 20 tags", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: Array.from({ length: 21 }, (_, index) => `tag${index}`),
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Maximum 20 tags are allowed"
            );
        }
    });

    it("should accept exactly 20 tags", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: Array.from({ length: 20 }, (_, index) => `tag${index}`),
        });

        expect(result.success).toBe(true);
    });

    it("should reject duplicate tags", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: ["work", "work"],
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Tags must be unique."
            );
        }
    });

    it("should accept unique tags", () => {
        const result = createNoteSchema.safeParse({
            title: "My note",
            tags: ["work", "personal", "important"],
        });

        expect(result.success).toBe(true);
    });
});

describe("updateNoteSchema", () => {
    it("should validate a complete note update", () => {
        const result = updateNoteSchema.safeParse({
            title: "Updated note",
            content: "Updated content",
            tags: ["updated"],
            isPinned: true,
        });

        expect(result.success).toBe(true);
    });

    it("should allow a partial update", () => {
        const result = updateNoteSchema.safeParse({
            title: "Updated title",
        });

        expect(result.success).toBe(true);
    });

    it("should allow an empty update object", () => {
        const result = updateNoteSchema.safeParse({});

        expect(result.success).toBe(true);
    });

    it("should reject an empty title", () => {
        const result = updateNoteSchema.safeParse({
            title: "",
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Title cannot be empty."
            );
        }
    });

    it("should reject a title longer than 200 characters", () => {
        const result = updateNoteSchema.safeParse({
            title: "a".repeat(201),
        });

        expect(result.success).toBe(false);
    });

    it("should reject content larger than 500000 characters", () => {
        const result = updateNoteSchema.safeParse({
            content: "a".repeat(500001),
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Content is too large."
            );
        }
    });

    it("should reject duplicate tags", () => {
        const result = updateNoteSchema.safeParse({
            tags: ["work", "work"],
        });

        expect(result.success).toBe(false);

        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Tags must be unique."
            );
        }
    });

    it("should reject more than 20 tags", () => {
        const result = updateNoteSchema.safeParse({
            tags: Array.from({ length: 21 }, (_, index) => `tag${index}`),
        });

        expect(result.success).toBe(false);
    });

    it("should reject an empty tag", () => {
        const result = updateNoteSchema.safeParse({
            tags: ["work", ""],
        });

        expect(result.success).toBe(false);
    });
});