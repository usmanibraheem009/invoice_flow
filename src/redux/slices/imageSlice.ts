import { createSlice } from "@reduxjs/toolkit";

const ImageSlice = createSlice({
    name: 'imageSlice',
    initialState: {
        imageUrl : ''
    },
    reducers: {
        setProfileImage : (state, action) => {
            state.imageUrl = action.payload
        },
        clearProfileImage : (state) => {
            state.imageUrl = '';
        }
    }
});

export const {setProfileImage, clearProfileImage} = ImageSlice.actions;
export default ImageSlice.reducer;