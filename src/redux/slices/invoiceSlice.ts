import { createSlice } from "@reduxjs/toolkit";

interface InvoiceProps{
    currentInvoiceNumber: string,
};

const initialState: InvoiceProps = {
    currentInvoiceNumber: 'INV-0001',
};

const generateInvoiceNumber = (lastNumber: number = 0) => {
    const nextNumber = lastNumber + 1;
    return `INV-${String(nextNumber).padStart(4, '0')}`; 
};

const InvoiceSlice = createSlice({
    name: 'invoiceSlice',
    initialState,
    reducers: {
        setInvoiceNumber: (state, action) => {
            state.currentInvoiceNumber = action.payload; 
        },
        incrementInvoiceNumber: (state) => {
            const lastNumber = parseInt(state.currentInvoiceNumber.split('-')[1]);
            state.currentInvoiceNumber = generateInvoiceNumber(lastNumber);
        }
    }
});

export const {setInvoiceNumber, incrementInvoiceNumber} = InvoiceSlice.actions;
export default InvoiceSlice.reducer;