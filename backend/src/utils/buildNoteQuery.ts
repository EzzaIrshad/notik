import type { SortOrder } from "mongoose";

// Escape regex special characters so search text can be used safely in Mongo queries
const escapeRegex = (value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export type BuildNoteQueryParams = {
    userId?: string;
    search?: string;
    isPinned?: "true" | "false";
    sort?: "createdAt" | "updatedAt";
};

// Builds Mongoose filter and sort objects based on incoming query params
export const buildNoteQuery = ({
    userId,
    search,
    isPinned,
    sort,
}: BuildNoteQueryParams) => {

    // Restrict queries to the requesting user's data
    const filter: Record<string, unknown> = {
        userId,
    };

    // Case-insensitive search for title, content, and tags
    if (search) {
        const searchQuery = escapeRegex(search);

        filter.$or = [
            {
                title: {
                    $regex: searchQuery,
                    $options: "i",
                },
            },
            {
                content: {
                    $regex: searchQuery,
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: searchQuery,
                    $options: "i",
                },
            },
        ];
    }

    // Apply pinned filter only when query includes it
    if (isPinned !== undefined) {
        filter.isPinned = isPinned === "true";
    }

    // Always keep pinned items at the top and rest by last updated
    let sortOption: Record<string, SortOrder> = {
        isPinned: -1,
        updatedAt: -1,
    };

    // Overide sort criteria if created date is requested
    if (sort === "createdAt") {
        sortOption = {
            isPinned: -1,
            createdAt: -1,
        };
    }

    return { filter, sortOption };
};
