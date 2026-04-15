import { Product } from "@/src/apis/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface product {
    id: string,
    name: string,
    description?: string,
    unitPrice: number,
    unitCode?: string,
    isActive: boolean,
};

interface productState {
    products: product[]
};

const initialState: productState = {
    products: []
};

const productsSlice = createSlice({
    name: 'productsSlice',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
        },
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload
        },
        deleteStoredProduct: (state, action) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            );
        },
        updateStoredProduct: (state, action) => {
            const index = state.products.findIndex((product) => product.id === action.payload.id);

            if (index !== -1) {
                state.products[index] = action.payload
            }
        },
        clearAllProducts: (state) => {
            state.products = [];
        }
    }
});

export const { addProduct, setProducts, deleteStoredProduct, updateStoredProduct, clearAllProducts } = productsSlice.actions;
export default productsSlice.reducer;