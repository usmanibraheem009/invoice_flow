import axios from 'axios';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { refreshAccessToken } from '../services/tokenService';
import { getDeviceType } from '../utils/device-type';

const deviceName = Device.deviceName || 'expo-device';
const deviceType = getDeviceType();
const deviceId = Application.applicationId || 'unknown-id';

const axiosInstance = axios.create({
    baseURL: 'https://lite-invoice.zapta.space',
    timeout: 15000,
    headers: {
        'X-Device-Name': deviceName,
        'X-Device-Type': deviceType,
        'X-Device-Id': deviceId,
    },

});

axiosInstance.interceptors.request.use(
    async (config) => {

        const token = await SecureStore.getItemAsync('accessToken');

        if (token) { config.headers.Authorization = `Bearer ${token}` }
        console.log('token: ', token);

        return config;
    },
    (error) => Promise.reject(error)

);

axiosInstance.interceptors.response.use(

    response => response,

    async (error) => {

        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const newToken = await refreshAccessToken();
                console.log('new token: ', newToken);

                if (!newToken) {
                    return Promise.reject(error);
                }

                await SecureStore.setItemAsync('accessToken', newToken)

                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }

        }
        return Promise.reject(error);
    },
);

export default axiosInstance;