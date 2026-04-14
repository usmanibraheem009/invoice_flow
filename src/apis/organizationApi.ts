import axiosInstance from "./axiosInstance";
import { OrganizationRequest, OrganizationResponse } from "./types/type";

export const createOrganization = async (data: OrganizationRequest) => {
    try {
        const res = await axiosInstance.post<OrganizationResponse>('/organization', data);
        console.log("response:", res.data);
        return res.data
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Invalid data entered')
        }

        if (error.request) {
            throw new Error('No response from server. Check internet.');
        }

        throw new Error(error.message || 'Something went wrong');
    }

}

export const fetchOrganization = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/organization/${id}`);
        console.log('organization data retrieved: ', res.data);
        return res.data;
    } catch (error: any) {
        console.log(error.message)
    }
};

export const updateOrganization = async (id: string, data: OrganizationRequest) => {
    try {
        const res = await axiosInstance.patch(`/organization/${id}`, {
            legalName: data.legalName,
            taxId: data.taxId,
            homeCurrency: data.homeCurrency
        });
        return res.data
    } catch (error: any) {
        throw new Error(error.message);
    }
};


export const deleteOrganization = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/organization/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
}