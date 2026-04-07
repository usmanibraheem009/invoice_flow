import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TemplateState {
    selectedTemplateId: string | null,
    rememberChoice: boolean,
};

const initialState : TemplateState = {
    selectedTemplateId: 'template1',
    rememberChoice: false
}

export const loadPersistedTemp = createAsyncThunk<{ selectedTemplateId: string; rememberChoice: boolean }>(
    'invoiceTemplate/loadPersistedTemplate',
    async (_ , thunkAPI) => {
        try{
            const storedTemplate = await AsyncStorage.getItem('@selectedTemplateId');
            const storedRemember = await AsyncStorage.getItem('@rememberChoice');
            return{
                selectedTemplateId : storedTemplate ?? 'template1',
                rememberChoice: storedRemember === 'true'? true : false
            }
        }catch(error){
            console.log('Error loading template', error);
            return{selectedTemplateId: 'template1', rememberChoice: false};
        }
    }
);

export const persistTemplate = createAsyncThunk(
    'invoiceTemplate/persistTemplateChoice',
    async (state : TemplateState, thunkAPI) => {
        try{
            await AsyncStorage.setItem('@selectedTemplateId', state.selectedTemplateId ?? 'template1')
            await AsyncStorage.setItem('@remeberChoice', state.rememberChoice.toString());
        }catch(error){
            console.log('Error persisting template', error);
        }
    }
)

const TemplateSlice = createSlice({
    name: 'invoiceTemplate',
    initialState,
    reducers: {
        setTemplateId: (state, action) => {
            state.selectedTemplateId = action.payload
        },
        setRememberChoice: (state, action) => {
            state.rememberChoice = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadPersistedTemp.fulfilled, (state, action) => {
            state.selectedTemplateId = action.payload.selectedTemplateId;
            state.rememberChoice = !! action.payload.rememberChoice;
        })
    }
});

export const {setTemplateId, setRememberChoice} = TemplateSlice.actions;
export default TemplateSlice.reducer;