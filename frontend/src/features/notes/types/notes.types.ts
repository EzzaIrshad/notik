export interface Note {
    _id: string,
    title: string,
    content: string,
    userId: string,
    isPinned: boolean,
    tags: string[],
    createdAt: string,
    updatedAt: string
}

export interface NotesQueryParams {
    search?: string,
    isPinned?:boolean,
    sort?: "createdAt" | "updatedAt"
}