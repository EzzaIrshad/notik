import {api} from '../../../shared/api/axiosInstance';
import type { ApiResponse } from '../../../shared/types/api.types';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UserResponse
} from '../types/auth.types';

// call api to send credentials for new profile
export const register = async (data: RegisterRequest): Promise<RegisterResponse> =>{
    
    const response = await api.post<RegisterResponse>('/auth/register', data);

    return response.data;

}

// call api to authenticate credentials for login
export const login = async (data: LoginRequest): Promise<LoginResponse> =>{

    const response = await api.post<LoginResponse>('/auth/login', data);

    return response.data;

}

// call api to get the registered user details
export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/auth/me');

    return response.data;
}

// call api to logout the user
export const logout = async(): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');

    return response.data;
}