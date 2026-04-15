import axiosInstance from "./axiosInstance";
import { Product } from "./types/type";

export const createProduct = async (payload: Product) => {
    const res = await axiosInstance.post('/product', payload);
    return res.data;
};

export const fetchProducts = async (page: number = 1) => {
    const res = await axiosInstance.get(`/product?limit=10&page=${page}`);

    return res.data;
};

export const getProductById = async (id: string) => {
    const res = await axiosInstance.get(`/product/${id}`);
    return res.data;
};

export const updateProduct = async (id: string, data: Product) => {
    const res = await axiosInstance.patch(`/product/${id}`, {
        name: data.name,
        description: data.description,
        unitPrice: data.unitPrice,
        unitCode: data.unitCode,
        isActive: data.isActive
    });
    console.log('updated product: ', res.data)
    return res.data;
};

export const deleteProduct = async (id: string) => {
    const res = await axiosInstance.delete(`/product/${id}`);
    console.log('deleted product', res.data)
    return res.data;
};