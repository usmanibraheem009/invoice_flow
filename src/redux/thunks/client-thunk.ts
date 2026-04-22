import { fetchClients } from '@/src/apis/clientApi';
import { setClients } from '../slices/clientsSlice';
import { AppDispatch } from '../store/myStore';

export const loadClients = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchClients();
        const apiClients = response.data.data;
        console.log('fetched clients: ', apiClients)

        const mappedClients = apiClients.map((item: any) => ({
            id: item.id,
            clientName: item.name,
            clientEmail: item.email,
            phone: item.phone,
            addressLine1: item.addressLine1,
            country: item.country,
            state: item.state,
            city: item.city,
            postalCode: item.postalCode,
            createdAt: item.createdAt
        })).filter((item: any) => item.id && item.clientName)

        dispatch(setClients(mappedClients));
    } catch (error: any) {
        console.log('Error fetching clients: ', error);
    }
};