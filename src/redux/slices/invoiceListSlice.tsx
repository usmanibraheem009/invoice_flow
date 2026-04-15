import { getInvoices } from "@/src/apis/invoiceApi";
import { Invoice, InvoiceMeta } from "@/src/apis/types/type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InvoiceState {
    invoices: Invoice[],
    meta: InvoiceMeta | null,
    loading: boolean,
    error: string | null
};

const initialState: InvoiceState = {
    invoices: [],
    meta: null,
    loading: false,
    error: null,
};

export const fetchInvoices = createAsyncThunk(
    "invoices/fetchInvoices",
    async (params: { page?: number; limit?: number }) => {
        const response = await getInvoices(params);
        return response.data;
    }
);

const invoicesList = createSlice({
    name: 'invoicesList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchInvoices.pending, (state) => {
            state.loading = true
        })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.invoices = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "failed to fetch invoices";
            })
    }
});

export default invoicesList.reducer;