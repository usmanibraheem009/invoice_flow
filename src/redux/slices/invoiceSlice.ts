import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LineItem {
    id: string;
    productId: string,
    name?: string,
    description: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
};

interface InvoiceDraft {
    id: string;
    invoiceId?: string;
    clientId: string | null;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    notes: string;
    status: "DRAFT" | "PAID" | "OVERDUE" | "PENDING";
    lineItems: LineItem[];
};

interface InvoiceState {
    currentInvoiceNumber: string;
    draft: InvoiceDraft;
};

const initialState: InvoiceState = {
    currentInvoiceNumber: 'INV-0001',
    draft: {
        id: '',
        clientId: null,
        invoiceNumber: "INV-0001",
        issueDate: "",
        dueDate: "",
        currency: "USD",
        notes: "",
        status: "DRAFT",
        lineItems: []
    }
}

export const generateInvoiceNumber = (lastNumber: number = 0) => {
    const nextNumber = lastNumber + 1;
    return `INV-${String(nextNumber).padStart(4, '0')}`;
};

const InvoiceSlice = createSlice({
    name: 'invoiceSlice',
    initialState,
    reducers: {
        setInvoiceNumber: (state, action: PayloadAction<string>) => {
            state.currentInvoiceNumber = action.payload;
            state.draft.invoiceNumber = action.payload
        },
        incrementInvoiceNumber: (state) => {
            const lastNumber = parseInt(state.currentInvoiceNumber.split('-')[1]);
            const newNumber = generateInvoiceNumber(lastNumber);

            state.currentInvoiceNumber = newNumber;
            state.draft.invoiceNumber = newNumber;
        },
        clearInvoiceNumber: (state) => {
            state.currentInvoiceNumber = 'INV-0001'
            state.draft.invoiceNumber = 'INV-0001'
        },
        setClient: (state, action: PayloadAction<string>) => {
            state.draft.clientId = action.payload;
        },
        setInvoiceField: (state, action: PayloadAction<{ field: keyof InvoiceDraft, value: any }>) => {
            (state.draft as any)[action.payload.field] = action.payload.value;
        },
        addLineItem: (state, action: PayloadAction<LineItem>) => {
            state.draft.lineItems.push(action.payload);
        },
        removeLineItem: (state, action: PayloadAction<string>) => {
            state.draft.lineItems = state.draft.lineItems.filter(item => item.id !== action.payload);
        },
        clearInvoiceDraft: (state) => {
            state.draft = {
                id: '',
                clientId: null,
                invoiceNumber: state.currentInvoiceNumber,
                issueDate: "",
                dueDate: "",
                currency: "USD",
                notes: "",
                status: "DRAFT",
                lineItems: []
            }
        },
        setInvoiceDraft: (state, action: PayloadAction<Partial<InvoiceDraft>>) => {
            state.draft = { ...state.draft, ...action.payload, };
        },
        updateLineItem: (
            state,
            action: PayloadAction<LineItem>
        ) => {
            const index = state.draft.lineItems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) { state.draft.lineItems[index] = action.payload }
        },
        setInvoiceStatus: (state, action: PayloadAction<"DRAFT" | "PAID" | "OVERDUE" | "PENDING">) => {
            state.draft.status = action.payload;
        },
        setNotes: (state, action: PayloadAction<string>) => {
            state.draft.notes = action.payload;
        },
    }
});

export const { setNotes, setInvoiceNumber, incrementInvoiceNumber, clearInvoiceNumber, updateLineItem, setInvoiceDraft, addLineItem, clearInvoiceDraft, removeLineItem, setClient, setInvoiceField, setInvoiceStatus } = InvoiceSlice.actions;
export default InvoiceSlice.reducer;