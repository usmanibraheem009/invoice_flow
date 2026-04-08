import axios from 'axios';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

const deviceName = Device.deviceName || 'expo-device';
const deviceType = Device.osName || 'unknown';
const deviceId = Application.applicationId || 'unknown-id';

const axiosInstance = axios.create({
    baseURL: 'http://44.220.243.34/api/',
    headers: {
        'X-Device-Name': deviceName,
        'X-Device-Type': deviceType,
        'X-Device-Id': deviceId,
    },

});

export default axiosInstance;