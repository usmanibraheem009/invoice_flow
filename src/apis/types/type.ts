export interface SignupRequest {
    fullName: string,
    email: string,
    password: string,
};

export interface SignupResponse {
    id: string,
    fullName: string,
    email: string,
    token: string
};

export interface LoginRequest {
    email: string,
    password: string,
};

export interface LoginSession {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    expiresAt: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginSession;
};

export interface User {
    id: string
    fullName: string
    email: string
    status: 'ACTIVE' | 'INACTIVE'
    role: 'ADMIN' | 'USER'
    createdAt: string
};

export interface OrganizationRequest {
    organizationId: string,
    legalName: string,
    taxId?: string,
    homeCurrency: string,
};

export interface OrganizationResponse {
    success: boolean,
    message: string,
    data: string[]
};

export interface Client {
    id: string,
    name: string,
    email?: string,
    phone?: string,
    addressLine1?: string,
    city?: string,
    state?: string,
    country?: string,
    postalCode?: string,
    ceratedAt?: string,
    updatedAt?: string,
};

export interface createClientPayload {
    name: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
};

export interface UpdateClientPayload
    extends createClientPayload {
    id: string;
};

export interface Product {
    id: string;
    name: string;
    description?: string | '';
    unitPrice: number;
    unitCode?: string;
    isActive: boolean;
};

export interface LineItemPayload {
    productId: string;
    description: string;
    unitPrice: number;
    taxRate: number;
    quantity: number;
};

export interface createInvoicePayload {
    clientId: string,
    invoiceNumber: string,
    issueDate: string,
    dueDate: string,
    currency: string,
    notes: string,
    status: "DRAFT" | "PAID" | "UNPAID",
    lineItems: LineItemPayload[]
};

export interface LineItem {
    id: string;
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    discount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
};

export type InvoiceStatus = "DRAFT" | "PAID" | "UNPAID" | "OVERDUE";

export interface Invoice {
    id: string;
    clientId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    notes: string;
    status: InvoiceStatus;
    createdAt: string;
    updatedAt: string;
    client: Client;
    totalAmount: string
}

export interface InvoiceMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedInvoicesResponse {
    data: Invoice[];
    meta: InvoiceMeta;
}
