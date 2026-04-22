import { fetchProducts } from "@/src/apis/productApi";
import { Product } from "@/src/apis/types/type";
import { setProducts } from "../slices/productsSlice";
import { showSnackbar } from "../slices/snackbarSlice";
import { AppDispatch } from "../store/myStore";

export const normalizeProduct = (product: any): Product => {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        unitPrice: Number(product.unitPrice),
        unitCode: product.unitCode,
        isActive: product.isActive,
    };
};

export const fetchAllProducts = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchProducts();
        const fetchedProducts = response.data.data;
        const normalizedProducts = fetchedProducts.map((product: any) => normalizeProduct(product));
        dispatch(setProducts(normalizedProducts));
    } catch (error: any) {
        dispatch(showSnackbar({ message: error.message, type: 'error' }));
    }
}