import ProductCard, { InvoiceItem } from '@/src/components/invoice/product-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import ItemModal from '@/src/components/primitives/item-modal'
import useTheme from '@/src/hooks/useTheme'
import { addProduct, deleteProduct, updateProduct } from '@/src/redux/slices/productsSlice'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const Products = () => {

    const { theme } = useTheme();
    const dispatch = useDispatch();
    const products = useSelector((state: any) => state.productsReducer.products);
    console.log(products);
    
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InvoiceItem | null>(null);

    const deleteItem = (id: string) => {
        dispatch(deleteProduct(id))
    }

    const editAddedItem = (item: InvoiceItem) => {
        setSelectedItem(item)
        setVisible(true);
    };

    const handleSubmitItem = (item: InvoiceItem) => {
        if(selectedItem){
            dispatch(updateProduct(item));
        }else{
            dispatch(addProduct(item));
        }

        setSelectedItem(null);
    }

    return (
        <ScreenWrapper>
            <AuthHeader title='Products' />
            <FloatingButton icon='add' onPress={() => { setVisible(true)}} />

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20, paddingHorizontal: mVs(20) }}
                ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}> No items added yet </Text>)}
                renderItem={({ item }) => {
                    return (
                        <>
                            <ProductCard
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                unitPrice={item.price}
                                type={item.type}
                                onDelete={() => deleteItem(item.id)}
                                onEdit={() => editAddedItem(item)}
                            />

                        </>
                    )
                }}>
            </FlatList>

            <ItemModal visible={visible} onClose={() => setVisible(false)} onSubmitItem={handleSubmitItem} editItem={selectedItem}/>
        </ScreenWrapper>
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