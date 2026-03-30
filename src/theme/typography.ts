import { mS } from "../utils/scale";
import { FontWeight, Typography } from "./types";

export const fontFamilies = {
    thin: 'Inter-Thin',
    etxralight: 'Inter-ExtraLight',
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: ' Inter-Bold',
    semibold: 'Inter-SemiBold',
    extrabold: 'Inter-ExtraBold',
    black: 'Inter-Black'
}as const;

export const getFontFamily = (weight: FontWeight): string => {
    return fontFamilies[weight] || fontFamilies.regular
};


export const typography: Typography = {
  displayLarge: {
    fontSize: mS(57),
    lineHeight: mS(64),
    letterSpacing: -0.25,
    fontFamily: fontFamilies.bold,
    fontWeight: 'bold',
  },
  displayMedium: {
    fontSize: mS(45),
    lineHeight: mS(52),
    letterSpacing: 0,
    fontFamily: fontFamilies.bold,
    fontWeight: 'bold',
  },
  displaySmall: {
    fontSize: mS(36),
    lineHeight: mS(44),
    letterSpacing: 0,
    fontFamily: fontFamilies.bold,
    fontWeight: 'bold',
  },
  headlineLarge: {
    fontSize: mS(32),
    lineHeight: mS(40),
    letterSpacing: 0,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
  headlineMedium: {
    fontSize: mS(28),
    lineHeight: mS(36),
    letterSpacing: 0,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
  headlineSmall: {
    fontSize: mS(24),
    lineHeight: mS(32),
    letterSpacing: 0,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
  titleLarge: {
    fontSize: mS(22),
    lineHeight: mS(28),
    letterSpacing: 0,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
  titleMedium: {
    fontSize: mS(16),
    lineHeight: mS(24),
    letterSpacing: 0.15,
    fontFamily: fontFamilies.medium,
    fontWeight: 'medium',
  },
  titleSemibold: {
    fontSize: mS(14),
    lineHeight: mS(20),
    letterSpacing: 0.1,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
  titleSmall: {
    fontSize: mS(14),
    lineHeight: mS(20),
    letterSpacing: 0.1,
    fontFamily: fontFamilies.medium,
    fontWeight: 'medium',
  },
  bodyLarge: {
    fontSize: mS(16),
    lineHeight: mS(24),
    letterSpacing: 0.5,
    fontFamily: fontFamilies.regular,
    fontWeight: 'regular',
  },
  bodyMedium: {
    fontSize: mS(14),
    lineHeight: mS(20),
    letterSpacing: 0.25,
    fontFamily: fontFamilies.regular,
    fontWeight: 'regular',
  },
  bodySmall: {
    fontSize: mS(12),
    lineHeight: mS(16),
    letterSpacing: 0.4,
    fontFamily: fontFamilies.regular,
    fontWeight: 'regular',
  },
  labelLarge: {
    fontSize: mS(14),
    lineHeight: mS(20),
    letterSpacing: 0.1,
    fontFamily: fontFamilies.medium,
    fontWeight: 'medium',
  },
  labelMedium: {
    fontSize: mS(12),
    lineHeight: mS(16),
    letterSpacing: 0.5,
    fontFamily: fontFamilies.medium,
    fontWeight: 'medium',
  },
  labelSmall: {
    fontSize: mS(11),
    lineHeight: mS(16),
    letterSpacing: 0.5,
    fontFamily: fontFamilies.medium,
    fontWeight: 'medium',
  },
  actionLarge: {
    fontSize: mS(16),
    lineHeight: mS(24),
    letterSpacing: 0.1,
    fontFamily: fontFamilies.semibold,
    fontWeight: 'semibold',
  },
};
