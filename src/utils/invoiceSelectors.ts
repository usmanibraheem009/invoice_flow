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
    state.invoicesListReducer.invoices ?? [];

const selectClients = (state: RootState) =>
    state.clientsReducer.clients ?? [];

const selectProducts = (state: RootState) =>
    state.productsReducer.products ?? [];


export const selectEnrichedInvoices = createSelector(
    [selectInvoices, selectClients, selectProducts],
    (invoices, clients, products) => {

        const clientsMap: Record<string, any> = {};
        clients?.forEach((client: any) => {
            clientsMap[client.id] = client;
        });

        const productsMap: Record<string, any> = {};
        products?.forEach((prod: any) => {
            productsMap[prod.id] = prod;
        });

        return invoices.map((invoice: any) => {

            const client = clientsMap[invoice.clientId];

            return {
                ...invoice,
                clientName: client?.clientName ?? "Deleted Client",
                clientEmail: client?.clientEmail ?? "Deleted email",
                clientPhone: client?.phone ?? "",
                clientCountry: client?.country ?? "",
                clientState: client?.state ?? "",
                clientCity: client?.city ?? "",
                clientAddress: client?.addressLine1 ?? "",

                lineItems: invoice.lineItems?.map((item: any) => {
                    const product = productsMap[item.id];
                    const quantity = Number(item.quantity ?? 0);
                    const unitPrice = Number(item.unitPrice ?? 0);

                    return {
                        ...item,
                        productName: product?.name ?? 'unknown product',
                        productDescription: product?.description ?? 'N/A',

                        quantity,
                        unitPrice,
                        total: quantity * unitPrice
                    }
                }) ?? [],

                currency: invoice.currency ?? "USD",
                invoiceNumber: invoice.invoiceNumber ?? "",
                status: invoice.status ?? "draft",

                subtotal: invoice.lineItems?.reduce(
                    (sum: number, item: any) =>
                        sum + (item.quantity ?? 0) * (item.unitPrice ?? 0), 0) ?? 0,

                taxTotal:
                    invoice.lineItems?.reduce((sum: number, item: any) =>
                        sum + ((item.quantity ?? 0) *
                            (item.unitPrice ?? 0) *
                            (item.taxRate ?? 0)) / 100,
                        0) ?? 0,
            };
        });
    }
);

export const selectEnrichedInvoiceById = (invoiceId: string) =>
    createSelector(
        [
            (state: RootState) => state.invoicesListReducer.selectedInvoice,
            (state: RootState) => state.clientsReducer.clients,
            (state: RootState) => state.productsReducer.products,
        ],
        (invoice, clients, products) => {

            if (!invoice) return null;

            const clientMap = Object.fromEntries(
                clients.map((c: any) => [c.id, c])
            );

            const productMap = Object.fromEntries(
                products.map((p: any) => [p.id, p])
            );

            const client = clientMap[invoice.clientId];

            return {
                ...invoice,

                clientName: client?.clientName ?? "Unknown Client",
                clientEmail: client?.clientEmail ?? "",

                lineItems: invoice.lineItems?.map((item: any) => {
                    const product = productMap[item.productId];

                    return {
                        ...item,
                        productName: product?.name ?? "Unknown Product",
                        lineTotal: item.quantity * item.unitPrice,
                    };
                }) ?? [],
            };
        }
    );

export const selectInvoicesByClientId =
    (clientId: string) => createSelector(
        [selectEnrichedInvoices],
        (invoices) => invoices.filter((inv: any) => inv.clientId === clientId)
    );

export const selectClientInvoiceSummary =
    (clientId: string) =>
        createSelector(
            [selectInvoicesByClientId(clientId)],
            (invoices) => {
                let paidAmount = 0;
                let unpaidAmount = 0;

                const mappedInvoices = invoices?.map((inv: any) => {
                    const total = inv.totalAmount ?? 0;  // ← already on invoice

                    if (inv.status === 'PAID') {
                        paidAmount += total;
                    } else {
                        unpaidAmount += total;
                    }

                    return { ...inv, totalAmount: total };
                });

                return { totalInvoices: invoices.length, paidAmount, unpaidAmount, mappedInvoices };
            }
        );