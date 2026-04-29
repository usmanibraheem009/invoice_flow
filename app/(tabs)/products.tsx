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
import { AppDispatch, RootState } from '@/src/redux/store/myStore'
import { fetchAllProducts, normalizeProduct } from '@/src/redux/thunks/products-thunk'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Products = () => {

    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.productsReducer.products);
    const loading = useSelector((state: RootState) => state.loadingReducer.loading);

    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Product | null>(null);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            await dispatch(fetchAllProducts());
        } finally {
            setRefreshing(false);
        }
    };

    const handleSubmitItem = async (item: Product) => {
        if (selectedItem) {
            dispatch(setLoading(true));
            try {
                const response = await updateProduct(selectedItem.id, item);
                const updatedProduct = response.data;
                const normalizedProduct = normalizeProduct(updatedProduct);
                dispatch(updateStoredProduct(normalizedProduct));
                dispatch(showSnackbar({ message: `${t('common.updatedMsg', { param: `${t('products.product')}` })}`, type: 'success' }))
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
                dispatch(showSnackbar({ message: `${t('common.createdMsg', { param: `${t('products.product')}` })}`, type: 'success' }))
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
        Alert.alert(`${t('common.warning')}`, `${t('common.areYouSure', { param: `${t('products.product')}` })}`,
            [
                { text: `${t('common.cancel')}`, style: 'cancel', },
                {
                    text: `${t('common.yes')}`, style: 'destructive', onPress: async () => {
                        try {
                            await deleteProduct(id);
                            dispatch(showSnackbar({ message: `${t('common.deletedMsg', { param: `${t('products.product')}` })}`, type: 'success' }));
                            dispatch(deleteStoredProduct(id));
                        } catch (error: any) {
                            dispatch(showSnackbar({ message: error.message, type: 'error' }));
                        }
                    }
                }])
    };

    return (
        <Screen>
            <AuthHeader title={t('products.products')} />
            <FloatingButton icon='add' onPress={() => { setVisible(true) }} />

            {loading ? (
                <ActivityIndicator
                    size='large'
                    color={theme.text.secondary}
                    style={{ marginTop: mVs(50) }}
                />
            ) : (
                <FlatList
                    data={products}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20, paddingHorizontal: mVs(20) }}
                    ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}>{t('common.dummyText', { param: t('products.products') })}</Text>)}
                    renderItem={({ item }) => {
                        return (
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                unitPrice={item.unitPrice}
                                onDelete={() => deleteItem(item.id)}
                                onEdit={() => editAddedItem(item)}
                                mode='product' />

                        )
                    }} />
            )}

            <ItemModal visible={visible} onClose={() => setVisible(false)} onSubmitItem={handleSubmitItem} editItem={selectedItem} id='' name='' type='Product' />
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