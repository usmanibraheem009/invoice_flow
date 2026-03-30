import { semanticColors } from "./types";

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
    secondary: '#2DC653', // PAID
    tertiary: '#F4A261', // PENDING
    inverse: '#E63946', // OVERDUE
    disableText: '#6B7685' // DRAFT,
    // '#B0B8C1',
    // '#7A8491'
  },
  border: {
    primary: '#EAEDF2',
    secondary: '#D1D5DB',
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
    secondary: '#2DC653', // PAID
    tertiary: '#F4A261', // PENDING
    inverse: '#E63946', // OVERDUE
    disableText: '#6B7685' // DRAFT
  },
  border: {
    primary: '#2A3140',
    secondary: '#4B5563',
    tertiary: '#254A87',
  }
};