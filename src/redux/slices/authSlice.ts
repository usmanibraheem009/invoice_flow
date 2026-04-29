import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';


interface Authstate {
    accessToken: string | null;
    refreshToken: string | null;
    sessionId: string | null;
    expiresAt: string | null;
    isLoggedIn: boolean;
};

const initialState: Authstate = {
    accessToken: null,
    refreshToken: null,
    sessionId: null,
    expiresAt: null,
    isLoggedIn: false
};

const AuthSlice = createSlice({
    name: 'AuthSlice',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<Authstate>) => {
            const { accessToken, refreshToken, sessionId, expiresAt } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.sessionId = sessionId;
            state.expiresAt = expiresAt;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.sessionId = null;
            state.expiresAt = null;
            state.isLoggedIn = false;
        }
    }
});

export const { setSession, logout } = AuthSlice.actions;

export const saveSessionToStore = async (session: Authstate) => {
    await Promise.all([
        SecureStore.setItemAsync('accessToken', session.accessToken || ''),
        SecureStore.setItemAsync('refreshToken', session.refreshToken || ''),
        SecureStore.setItemAsync('sessionId', session.sessionId || ''),
        SecureStore.setItemAsync('expiresAt', session.expiresAt || '')
    ]);
};

export const loadSessionFromStore = async (): Promise<Authstate> => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const sessionId = await SecureStore.getItemAsync('sessionId');
    const expiresAt = await SecureStore.getItemAsync('expiresAt');
    const isLoggedIn = !!accessToken && !!refreshToken;

    return { accessToken, expiresAt, isLoggedIn, refreshToken, sessionId };
};

export const clearSessionFromStore = async () => {
    await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
        SecureStore.deleteItemAsync("sessionId"),
        SecureStore.deleteItemAsync("expiresAt"),
    ]);
}


export default AuthSlice.reducer;