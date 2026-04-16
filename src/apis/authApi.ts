import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from "./axiosInstance";
import { LoginRequest, LoginResponse, LoginSession, SignupRequest, User } from './types/type';

type SessionTokens = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    sessionId: string;
};

export const saveSession = async (
    session: SessionTokens
) => {
    await Promise.all([
        SecureStore.setItemAsync('accessToken', session.accessToken),
        SecureStore.setItemAsync('refreshToken', session.refreshToken),
        SecureStore.setItemAsync('expiresAt', session.expiresAt),
        SecureStore.setItemAsync('sessionId', session.sessionId),
    ]);
};


export const signupUser = async (data: SignupRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post('/user/signup', data);
        console.log("user created: ", response.data.data);

        const session = {
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            expiresAt: response.data.data.expiresAt,
            sessionId: response.data.data.sessionId
        };

        await saveSession(session);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Sign up failed')
        } else {
            throw new Error('Network error')
        }
    }
};


export const loginUser = async (
    data: LoginRequest
): Promise<LoginSession> => {

    try {
        const response = await axiosInstance.post<LoginResponse>(
            '/user/sign-in',
            data
        );

        const session = response.data.data;

        console.log("LOGIN RESPONSE:", session);

        await SecureStore.setItemAsync(
            'accessToken',
            session.accessToken
        );

        const savedToken =
            await SecureStore.getItemAsync('accessToken');

        console.log("TOKEN AFTER SAVE:", savedToken);

        axiosInstance.defaults.headers.common.Authorization =
            `Bearer ${session.accessToken}`;

        console.log(
            "GLOBAL HEADER TOKEN SET"
        );


        return session;

    } catch (error: any) {
        console.log(
            'Login API Error:',
            error?.response?.data || error.message
        );

        throw new Error(
            error?.response?.data?.message ||
            'Invalid credentials'
        );
    }
};

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
    'user/fetchCurrentUser',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/user/whoami');
            console.log("fetched current user: ", response.data.data);
            return response.data.data;

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data?.message || 'failed to fetch current user')
        }
    }
);

type decodedToken = {
    exp: number,
}

export const isTokenExpired = async () => {
    const token = await SecureStore.getItemAsync('accessToken');

    if (!token) return true;

    try {
        const decoded = jwtDecode<decodedToken>(token);

        const expiryTime = decoded.exp * 1000;
        return Date.now() >= expiryTime;
    } catch (error) {
        return true;
    }
};