export type ThemeMode = 'dark' | 'light' | 'system';

export interface ColorScale{
    50: string,
    100: string,
    200: string,
    300: string,
    400: string,
    500: string,
    600: string,
    700: string,
    800: string,
    900: string,
    950: string,
};

export interface semanticColors{
    background: {
        primary: string,
        secondary: string,
        tertiary: string
    },
    surface: {
        primary: string,
        secondary: string,
        tertiary: string
    },
    text: {
        primary: string,
        secondary: string,
        tertiary: string,
        inverse: string,
        disableText: string,
    },
    border: {
        primary: string,
        secondary: string,
        tertiary: string,
    }
};

export interface themeColors extends semanticColors {
    primary: ColorScale,
    secondary: ColorScale,
    neutral: ColorScale,
    success: ColorScale,
    warning: ColorScale,
    error: string,
    option: string
};

export interface TextStyle{
    fontSize: number,
    fontWeight: FontWeight,
    fontFamily: string,
    letterSpacing: number,
    lineHeight: number
};

export interface typography {
    displayLarge: string,
    displayMedium: string,
    displaySmall: string,
    titleLarge: string,
    titleMedium: string,
    titleSemibold: string,
    titleSmall: string,
    labelLarge: string,
    labelMedium: string,
    labelSmall: string,
    headingLarge: string,
    headingMedium: string,
    headingSmall: string,
    bodyLarge: string,
    bodyMedium: string,
    bodySmall: string,
}

export type FontWeight = 
    | 'regular'
    | 'bold'
    | 'semibold'
    | 'black'

