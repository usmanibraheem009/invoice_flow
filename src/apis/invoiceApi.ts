import axiosInstance from "./axiosInstance";

export interface paginationResponse {
    page?: number,
    limit?: number,
}

export const createInvoice = async (payload: any) => {
    const res = await axiosInstance.post('/invoice', payload);

    console.log('invoice created: ', res.data);
    return res.data;
};

export const getInvoices = async (params: paginationResponse) => {
    const res = await axiosInstance.get(`/invoice?limit=${params.limit}&&page=${params.page}`);
    console.log("fetched invoice: ", res.data.data.data);

    return res.data;
};

export const getInvoiceById = async (id: string) => {
    const response = await axiosInstance.get(`invoice/${id}`);

    return response.data;
}

export const updateInvoice = async (id: string, payload: any) => {
    const res = await axiosInstance.put(`/invoice/${id}`, payload);
    console.log('invoice updated: ', res.data);
    return res.data;
};

export const deleteInvoice = async (id: string) => {
    const res = await axiosInstance.delete(`/invoice/${id}`);
    console.log('invoice deleted: ', res.data);
    return res.data;
};

export const getInvoicesByClientId = async (clientId: string) => {
    const res = await axiosInstance.get(`/invoice?limit=50&page=1&clientId=${clientId}`);
    return res.data;
};