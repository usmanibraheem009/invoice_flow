import * as SecureStore from 'expo-secure-store';
import axiosInstance from "./axiosInstance";

interface SignupRequest{
    name: string,
    email: string,
    password: string,
};

interface SignupResponse{
    id: string,
    name: string,
    email: string,
    token: string
};

export const signupUser = async(data: SignupRequest): Promise<SignupResponse> => {
    try{
        const response = await axiosInstance.post<SignupResponse>('user/signup', data);
        await SecureStore.setItemAsync('userToken', response.data.token);

        return response.data;
    }catch(error: any){
        if(error.response){
            throw new Error(error.response.message || 'Sign up failed')
        }else{
            throw new Error('Network error')
        }
    }
};

export const getToken = async() => {
    return await SecureStore.getItemAsync('userToken')
};