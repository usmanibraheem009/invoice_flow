import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../redux/store/myStore";

export const selectInvoiceSubtotal = (state: RootState) => {
    return state.invoiceReducer.draft.lineItems
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const selectInvoiceDraft = (state: RootState) => state.invoiceReducer.draft;


export const selectInvoiceTaxTotal = (
    state: RootState) => {
    return state.invoiceReducer.draft.lineItems
        .reduce(
            (sum, item) =>
                sum +
                (item.unitPrice *
                    item.quantity *
                    item.taxRate) /
                100,
            0
        );
};

export const selectInvoiceGrandTotal = createSelector(
    [selectInvoiceSubtotal, selectInvoiceTaxTotal],
    (subtotal, taxTotal) => subtotal + taxTotal
);

export const selectInvoiceStatus = createSelector(
    [selectInvoiceDraft],
    (draft) => draft.status
);

export const getClientById = (state: RootState) => {
    const clientId = state.invoiceReducer.draft.clientId;
    const clients = state.clientsReducer.clients;

    return clients.find(c => c.id === clientId)?.clientName ?? "";
};

export const mapInvoiceToApi = (draft: any) => {
    return {
        clientId: draft.clientId,
        invoiceNumber: draft.invoiceNumber,
        issueDate: draft.issueDate ? draft.issueDate.split("T")[0] : "",
        dueDate: draft.dueDate ? draft.dueDate.split("T")[0] : "",
        currency: draft.currency,
        notes: draft.notes,
        status: draft.status,

        lineItems: draft.lineItems.map((item: any) => ({
            productId: item.productId,
            description: item.description,
            unitPrice: Number(item.unitPrice),
            taxRate: Number(item.taxRate ?? 0),
            quantity: Number(item.quantity),
        })),
    };
};

export interface EnrichedInvoice {
    id: string;
    clientId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: string;
    currency: string;
    notes?: string;
    clientName: string;
    grandTotal: string;
};
const selectInvoices = (state: RootState) =>
    state.invoicesListReducer.invoices;

const selectClients = (state: RootState) =>
    state.clientsReducer.clients; // adjust if reducer name differs

/**
 * Memoized enriched selector
 */

export const selectEnrichedInvoices = createSelector(
    [selectInvoices, selectClients],
    (invoices, clients) => {

        const clientsMap: Record<string, any> = {};

        clients?.forEach((client: any) => {
            clientsMap[client.id] = client;
        });

        return invoices.map((invoice: any) => ({
            ...invoice,

            clientName:
                clientsMap[invoice.clientId]?.clientName ??
                "Unknown Client",
        }));
    }
);