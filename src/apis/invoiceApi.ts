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