import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getStoredToken = async () => {
    return await SecureStore.getItemAsync('accessToken');
};

export const refreshAccessToken = async () => {
    try {
        const sessionId = await SecureStore.getItemAsync('sessionId');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        if (!sessionId) return null;

        const response = await axios.post('https://lite-invoice.zapta.space/user/refresh', { sessionId, refreshToken });
        const data = response.data.data;

        await SecureStore.setItemAsync('accessToken', data.accessToken);
        await SecureStore.setItemAsync('expiresAt', data.expiresAt);

        return data.accessToken;
    } catch (error: any) {
        throw new error;
    }
};