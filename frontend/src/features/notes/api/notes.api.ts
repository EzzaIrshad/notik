import { api } from "../../../shared/api/axiosInstance";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { CreateNoteInput, UpdateNoteInput } from "../schemas/note.schema";
import type { Note, NotesQueryParams } from "../types/notes.types";

/**
 * Retrieves a list of notes based on the provided query parameters.
 * @param params 
 * @returns 
 */
export const getNotes = async (params?: NotesQueryParams): Promise<ApiResponse<Note[]>> => {
    const response = await api.get<ApiResponse<Note[]>>('/notes/get-all-notes', {
        params
    });

    return response.data;
}


/**
 * Retrieves a specific note by its ID.
 * @param id 
 * @returns 
 */
export const getNote = async (id: string): Promise<ApiResponse<Note>> => {
    const response = await api.get<ApiResponse<Note>>(`/notes/get-note/${id}`);

    return response.data;
}

/**
 * Creates a new note.
 * @param data 
 * @returns 
 */
export const createNote = async (data: CreateNoteInput): Promise<ApiResponse<Note>> => {
    const response = await api.post<ApiResponse<Note>>('/notes/create', data);

    return response.data;
}

/**
 * Updates an existing note.
 * @param id 
 * @param data 
 * @returns 
 */
export const updateNote = async (id: string, data: UpdateNoteInput): Promise<ApiResponse<Note>> => {
    const response = await api.patch<ApiResponse<Note>>(`/notes/update/${id}`, data);

    return response.data;
}

/**
 * Deletes a note by its ID.
 * @param id 
 * @returns 
 */
export const deleteNote = async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/notes/delete/${id}`);

    return response.data;
}