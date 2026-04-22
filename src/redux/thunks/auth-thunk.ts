// src/redux/thunks/authThunks.ts
import { fetchCurrentUser, isTokenExpired } from '@/src/apis/authApi';
import { loadSessionFromStore, setSession } from '@/src/redux/slices/authSlice';
import { refreshAccessToken } from '@/src/services/tokenService';
import NetInfo from "@react-native-community/netinfo";
import { router } from 'expo-router';
import { AppDispatch } from '../store/myStore';

export const bootstrapAuth = () => async (dispatch: AppDispatch) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
        router.replace("/screens/no-internetScreen");
        return;
    }

    const session = await loadSessionFromStore();
    if (!session?.isLoggedIn) {
        router.replace('/screens/login-screen');
        return;
    }

    const expired = await isTokenExpired();
    if (expired) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
            router.replace('/screens/login-screen');
            return;
        }
    }

    dispatch(setSession(session));
    dispatch(fetchCurrentUser() as any);

    setTimeout(() => {
        router.replace('/(tabs)');
    }, 3000);
};