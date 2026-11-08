import type { ApiResponse } from "../../../shared/types/api.types";

export interface User {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
}

export interface AuthData {
    token: string;
    user: User;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ErrorResponse {
    message: string;
}

export type RegisterResponse = ApiResponse<AuthData>;

export type LoginResponse = ApiResponse<AuthData>;

export type UserResponse = ApiResponse<User>;