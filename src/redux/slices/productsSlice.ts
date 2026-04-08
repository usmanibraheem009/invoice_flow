import { createSlice } from "@reduxjs/toolkit";

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
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            );
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex((product) => product.id === action.payload.id);

            if(index !== -1){
                state.products[index] = action.payload
            }
        }
    }
});

export const { addProduct, deleteProduct, updateProduct } = productsSlice.actions;
export default productsSlice.reducer;