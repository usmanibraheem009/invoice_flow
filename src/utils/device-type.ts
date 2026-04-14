import * as Device from 'expo-device';

export const getDeviceType = () => {
    if(Device.deviceType === Device.DeviceType.PHONE){
        return 'MOBILE';
    }

    if(Device.deviceType === Device.DeviceType.TABLET){
        return 'TABLET';
    }

    if(Device.deviceType === Device.DeviceType.DESKTOP){
        return 'DESKTOP';
    }

    return 'null';
};


export const isTablet = () =>
  Device.deviceType === Device.DeviceType.TABLET;

export const isMobile = () =>
  Device.deviceType === Device.DeviceType.PHONE;

export const isDesktop = () =>
  Device.deviceType === Device.DeviceType.DESKTOP;