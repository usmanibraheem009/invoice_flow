import { getInvoiceById, getInvoices } from "@/src/apis/invoiceApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchClientInvoicesDetailed = createAsyncThunk(
    'invoices/fetchClientDetailed',
    async (clientId: string) => {
        const all = await getInvoices({ page: 1, limit: 100 });

        const filtered = all.filter((i: any) => i.clientId === clientId);

        const detailed = await Promise.all(
            filtered.map((i: any) => getInvoiceById(i.id).then(r => r.data))
        );

        return detailed;
    }
);

const initialState = {
    clientInvoices: []
};

const clientInvoicesSlice = createSlice({
    name: 'clientsInvoices',
    initialState,
    reducers: {
        addInvoices: (state, action) => {
            state.clientInvoices = action.payload;
        }
    }
});

export const { addInvoices } = clientInvoicesSlice.actions;

export default clientInvoicesSlice.reducer;