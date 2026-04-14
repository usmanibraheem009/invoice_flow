import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from "./axiosInstance";
import { LoginRequest, LoginResponse, LoginSession, SignupRequest, SignupResponse, User } from './types/type';


export const signupUser = async (data: SignupRequest): Promise<SignupResponse> => {
    try {
        const response = await axiosInstance.post<SignupResponse>('/user/signup', data);
        await SecureStore.setItemAsync('userToken', response.data.token);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Sign up failed')
        } else {
            throw new Error('Network error')
        }
    }
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('userToken')
};

export const loginUser = async (data: LoginRequest): Promise<LoginSession> => {
    try {
        const response = await axiosInstance.post<LoginResponse>('/user/sign-in', data);
        const session = response.data.data;

        await SecureStore.setItemAsync('accessToken', session.accessToken);
        await SecureStore.setItemAsync('refreshToken', session.refreshToken);
        await SecureStore.setItemAsync('expiresAt', session.expiresAt);
        await SecureStore.setItemAsync('sessionId', session.sessionId);

        return session;
    } catch (error: any) {

        console.log('Login API Error:',
            error?.response?.data || error.message
        );

        if (error.response) {
            throw new Error(
                error.response.data?.message ||
                'Invalid credentials'
            );
        }

        if (error.request) {
            throw new Error('No response from server. Check internet.');
        }

        throw new Error(error.message || 'Something went wrong');
    }
};

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
    'user/fetchCurrentUser',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/user/whoami');
            return response.data.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data?.message || 'failed to fetch current user')
        }
    }
);

type decodedToken ={
    exp : number,
}

export const isTokenExpired = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
        
    if (!token) return true;

    try{
        const decoded = jwtDecode<decodedToken>(token);

        const expiryTime = decoded.exp * 1000;
        return Date.now() >= expiryTime;
    }catch(error){
        return true;
    }
};