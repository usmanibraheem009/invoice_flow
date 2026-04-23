import { createProduct, deleteProduct, updateProduct } from '@/src/apis/productApi'
import { Product } from '@/src/apis/types/type'
import ProductCard from '@/src/components/invoice/product-card'
import { Screen } from '@/src/components/layout'
import FloatingButton from '@/src/components/primitives/floating-button'
import ItemModal from '@/src/components/primitives/item-modal'
import { useTheme } from '@/src/hooks/useTheme'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { addProduct, deleteStoredProduct, updateStoredProduct } from '@/src/redux/slices/productsSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { fetchAllProducts, normalizeProduct } from '@/src/redux/thunks/products-thunk'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Products = () => {

    const { theme } = useTheme();
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.productsReducer.products);
    console.log(products);

    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);

    useEffect(() => {
        dispatch(fetchAllProducts() as any);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        dispatch(fetchAllProducts() as any);
        setRefreshing(false);
    }

    const handleSubmitItem = async (item: Product) => {
        if (selectedItem) {
            dispatch(setLoading(true));
            try {
                const response = await updateProduct(selectedItem.id, item);
                const updatedProduct = response.data;
                const normalizedProduct = normalizeProduct(updatedProduct);
                dispatch(updateStoredProduct(normalizedProduct));
                dispatch(showSnackbar({ message: 'Product updated successfully', type: 'success' }));
                setVisible(false);
            } catch (error: any) {
                dispatch(showSnackbar({ message: error.message, type: 'error' }));
            } finally {
                dispatch(setLoading(false));
            }
        } else {
            dispatch(setLoading(true))
            try {
                console.log('payload being sent: ', item)
                const response = await createProduct(item);
                const product = response.data;
                const newProduct = normalizeProduct(product);
                dispatch(showSnackbar({ message: 'Product created successfully', type: 'success' }));
                dispatch(addProduct(newProduct));
                setVisible(false);
            } catch (error: any) {
                dispatch(showSnackbar({ message: error.message, type: 'error' }))
            } finally {
                dispatch(setLoading(false))
            }
        }

        setSelectedItem(null);
    };

    const editAddedItem = async (item: Product) => {
        setSelectedItem(item);
        setVisible(true);
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await deleteProduct(id);
            dispatch(showSnackbar({ message: response.message, type: 'success' }));
            dispatch(deleteStoredProduct(id));
        } catch (error: any) {
            dispatch(showSnackbar({ message: error.message, type: 'error' }));
        }
    };

    return (
        <Screen>
            <AuthHeader title='Products' />
            <FloatingButton icon='add' onPress={() => { setVisible(true) }} />

            <FlatList
                data={products}
                refreshing={refreshing}
                onRefresh={onRefresh}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20, paddingHorizontal: mVs(20) }}
                ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}> No items added yet </Text>)}
                renderItem={({ item }) => {
                    return (
                        <>
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                unitPrice={item.unitPrice}
                                onDelete={() => deleteItem(item.id)}
                                onEdit={() => editAddedItem(item)}
                                mode={'product'} />

                        </>
                    )
                }}>
            </FlatList>

            <ItemModal visible={visible} onClose={() => setVisible(false)} onSubmitItem={handleSubmitItem} editItem={selectedItem} id={''} name={''} type={'Product'} />
        </Screen>
    )
}

export default Products

const styles = StyleSheet.create({
    dummyText: {
        textAlign: 'center',
        marginTop: 80,
        fontSize: mVs(16),
        fontWeight: 500
    }
})