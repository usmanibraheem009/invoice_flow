import { ColorScale, semanticColors } from "./types";

export const secondary: ColorScale = {
  50: '#2DC653', //paid
  100: '#F4A261', //pending 
  200: '#E63946', //overdue
  300: '#6B7685' //draft
};


export const lightSemanticColors: semanticColors = {
  background: {
    primary: '#F8F9FB', 
    secondary: '#FFFF', 
    tertiary: '#E5E7EB' 
  },
  surface: {
    primary: '#00A896', //BUTTON
    secondary: '#2E4057', //FILTER
    tertiary: '#E63946' // LOGOUT
  },
  text: {
    primary: '#111827',
    secondary: '#6B7685',
    tertiary: '#00A896', // PENDING
    inverse: '#E63946', // OVERDUE
    disableText: '#6B7685' // DRAFT,
  },
  border: {
    primary: '#EAEDF2',
    secondary: '#EAEDF2',
    tertiary: '#9ABDF8',
  },
};

export const darkSemanticColors: semanticColors = {
  background: {
    primary: '#0F1319',
    secondary: '#1A1F2B',
    tertiary: '#374151'
  },
  surface: {
    primary: '#00A896', //BUTTON
    secondary: '#2E4057', //FILTER
    tertiary: '#E63946' // LOGOUT
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#B0B8C1',
    tertiary: '#00A896', // PENDING
    inverse: '#E63946', // OVERDUE
    disableText: '#6B7685' // DRAFT
  },
  border: {
    primary: '#2A3140',
    secondary: '#282F3D',
    tertiary: '#254A87',
  }
};