import { createSlice } from "@reduxjs/toolkit";

export interface Client {
    id: string;
    clientName: string;
    clientEmail: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    orgName?: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    profileImage?: string;
};

interface clientState{
    clients: Client[];
}

const initialState: clientState = {
    clients: []
}

const clientsSlice = createSlice({
    name: 'clientsSlice',
    initialState,
    reducers: {
        addClient: (state, action) => {
            state.clients.push(action.payload);
        }
    }
})

export const {addClient} = clientsSlice.actions;
export default clientsSlice.reducer;