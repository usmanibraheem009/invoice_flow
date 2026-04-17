import { getInvoiceById, getInvoices } from "@/src/apis/invoiceApi";
import { Invoice, InvoiceMeta } from "@/src/apis/types/type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InvoiceState {
    invoices: Invoice[],
    selectedInvoice: any | null,
    meta: InvoiceMeta | null,
    loading: boolean,
    error: string | null
};

const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: {} as Record<string, any>,
    meta: null,
    loading: false,
    error: null,
};

export const fetchInvoices = createAsyncThunk(
    "invoices/fetchInvoices",
    async (params: { page?: number; limit?: number }) => {
        const response = await getInvoices(params);
        console.log('returned data of invoices: ', response.data);

        return response.data;
    }
);

export const fetchInvoiceById = createAsyncThunk(
    "invoices/fetchInvoiceById",
    async (invoiceId: string) => {
        const response = await getInvoiceById(invoiceId);
        console.log('single invoice retruned');

        return response.data;
    }
)

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
            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedInvoice = action.payload
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'failed to fetch invoice details'
            })
    }
});

export default invoicesList.reducer;