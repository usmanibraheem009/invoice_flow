import axiosInstance from "./axiosInstance";
import { Client, createClientPayload } from "./types/type";

export const createClient = async (payload: createClientPayload): Promise<Client> => {
    const res = await axiosInstance.post('/client', payload);

    console.log('create client response: ', res.data);

    return res.data;
};

export const fetchClients = async (page: number = 1) => {
    const res = await axiosInstance.get(`/client?limit=10&page=${page}`);
    return res.data;
};

export const getClientById = async (id: string) => {
    const res = await axiosInstance.get(`/client/${id}`);

    console.log('returned client: ', res.data);
    return res.data;
};

export const updateClient = async (id: string, data: any) => {
    const res = await axiosInstance.patch(`/client/${id}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country
    });
    console.log('updated client: ', res.data);
    return res.data;
};

export const deleteExistingClient = async (id: string) => {
    const res = await axiosInstance.delete(`/client/${id}`);
    return res.data
}