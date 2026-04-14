import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type snackbarType = 'error' | 'success' | 'info' | 'null';

interface snackbarState {
    message: string,
    type: snackbarType | snackbarType
}

const initialState: snackbarState = {
    message: '',
    type: 'null',
}

const snackbarSlice = createSlice({
    name: 'snackBarSlice',
    initialState,
    reducers: {
        setSnackBar: (state, action: PayloadAction<{ message: string, type: snackbarType }>) => {
            state.message = action.payload.message,
                state.type = action.payload.type
        },
        clearSnackBar: (state) => {
            state.message = '';
            state.type = 'null';
        },
    }
});

export const { setSnackBar, clearSnackBar } = snackbarSlice.actions;
export default snackbarSlice.reducer;