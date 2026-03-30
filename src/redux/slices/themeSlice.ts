import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark'| 'system';

interface themeState { 
    currentMode : ThemeMode
};

const initialState : themeState = {
    currentMode : 'system'
}

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState,
    reducers: {
        setTheme : (state, action) => {
            state.currentMode = action.payload
        }
    }
});

export const {setTheme} = themeSlice.actions;
export default themeSlice.reducer;