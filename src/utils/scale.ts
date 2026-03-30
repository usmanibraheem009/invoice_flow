import { moderateScale, moderateVerticalScale, scale, verticalScale, } from 'react-native-size-matters';

export const mS = (size: number, factor?: number) : number => {
    return (moderateScale(size * 0.9, factor));
};

export const mVs = (size: number, factor?: number) : number => {
    return (moderateVerticalScale(size * 0.9, factor));
};

export const s = (size: number, factor?: number) : number => scale(size);
export const vs = (size: number, factor?: number ) : number => verticalScale(size);
export const ms = (size: number, factor?: number) : number => moderateScale(size, factor);
export const mvs = (size: number, factor?: number) : number => moderateVerticalScale(size, factor);