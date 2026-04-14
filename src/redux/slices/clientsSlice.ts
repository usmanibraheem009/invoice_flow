import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface clientState {
    clients: Client[];
}

const initialState: clientState = {
    clients: []
}

const clientsSlice = createSlice({
    name: 'clientsSlice',
    initialState,
    reducers: {
        addClient: (state, action: PayloadAction<Client>) => {
            if (!action.payload?.id) return;
            state.clients.unshift(action.payload);
        },
        setClients: (state, action: PayloadAction<Client[]>) => {
            state.clients = action.payload
        },
        deleteClient: (state, action: PayloadAction<string>) => {
            state.clients = state.clients.filter(
                (c) => c.id !== action.payload
            );
        },
        updateExistingClient: (state, action: PayloadAction<Client>) => {
            const index = state.clients.findIndex(
                (c) => c.id === action.payload.id
            );

            if (index !== -1) {
                state.clients[index] = action.payload; // replace existing
            }
        },
    }
})

export const { addClient, setClients, deleteClient, updateExistingClient } = clientsSlice.actions;
export default clientsSlice.reducer;