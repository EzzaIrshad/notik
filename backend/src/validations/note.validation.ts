import { z } from 'zod'

export const createNoteSchema = z.object({
    title: z
        .string({ error: "Title is required." })
        .trim()
        .min(1, "Title cannot be empty.")
        .max(200, "Title cannot exceed 200 characters."),
    content: z
        .string()
        .max(500000, "Content is too large.")
        .optional()
        .default(""),
    tags: z
        .array(
            z.string()
                .trim()
                .min(1, "Tag cannot be empty.")
                .max(30, "Tag cannot exceed 30 characters."),
        )
        .max(20, "Maximum 20 tags are allowed")
        .refine(
            (tags) => new Set(tags).size === tags.length,
            { message: "Tags must be unique." }
        )
        .optional()
        .default([]),
    isPinned: z
        .boolean()
        .optional()
        .default(false)
})

export const updateNoteSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty.")
        .max(200, "Title cannot exceed 200 characters.")
        .optional(),
    content: z
        .string()
        .max(500000, "Content is too large.")
        .optional(),
    tags: z
        .array(
            z.string()
                .trim()
                .min(1, "Tag cannot be empty.")
                .max(30, "Tag cannot exceed 30 characters."),
        )
        .max(20, "Maximum 20 tags are allowed")
        .refine(
            (tags) => new Set(tags).size === tags.length,
            { message: "Tags must be unique." }
        )
        .optional(),
    isPinned: z
        .boolean()
        .optional()
})

export const getNotesQuerySchema = z.object({
    search: z.string().trim().max(100).optional(),
    isPinned: z.enum(["true", "false"]).optional(),
    sort: z.enum(["createdAt", "updatedAt"]).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;