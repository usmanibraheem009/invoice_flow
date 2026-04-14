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

