import ProductCard from '@/src/components/invoice/product-card'
import { Screen } from '@/src/components/layout'
import SelectProduct, { LineItemForm } from '@/src/components/modals/select-product'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { addLineItem, removeLineItem, updateLineItem } from '@/src/redux/slices/invoiceSlice'
import { RootState } from '@/src/redux/store/myStore'
import { selectInvoiceSubtotal } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const LineItems = () => {

    const { theme } = useTheme();
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LineItemForm | null>(null);
    const items = useSelector((state: RootState) => state.invoiceReducer.draft.lineItems ?? []);
    console.log('line items: ', items);

    const subTotal = useSelector(selectInvoiceSubtotal);

    const handleSubmitItem = (newItem: any) => {
        const quantity = Number(newItem.quantity ?? 1);
        const unitPrice = Number(newItem.unitPrice);
        const lineItem = {
            id: newItem.id || Math.random().toString(36).substr(2, 9),
            productId: newItem.productId,
            name: newItem.name,
            description: newItem.description ?? '',
            unitPrice,
            quantity,
            taxRate: newItem.taxRate ?? 0
        }
        if (newItem.id) {
            dispatch(updateLineItem(lineItem));
        } else {
            dispatch(addLineItem(lineItem))
        }
        setVisible(false);
    };

    const deleteItem = (id: string) => {
        dispatch(removeLineItem((id)));
    };

    const editItem = (item: any) => {

        const formattedItem: LineItemForm = {
            id: item.id,
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate
        };

        setSelectedItem(formattedItem);
        console.log('formatted product id: ', formattedItem.productId);

        setVisible(true);
    };

    const previewInvoice = () => {

        if (items.length === 0) {
            Alert.alert('Warning', 'Please add at least one item');
            return;
        } else {
            router.push({
                pathname: '/screens/preview-screen'
            })
        }
    };

    return (
        <>
            <Screen >
                <AuthHeader arrowBack title='Step 2 of 3' />

                <View style={{ flex: 1, backgroundColor: theme.background.primary, paddingHorizontal: 20, maxHeight: 500 }}>
                    <Text style={[styles.title, { color: theme.text.primary }]} > Line Items </Text>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20 }}
                        ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}> No items added yet </Text>)}
                        renderItem={({ item }) => {
                            const total = item.quantity && item.unitPrice ? item.quantity * item.unitPrice : undefined;
                            return (
                                <ProductCard
                                    id={item.id}
                                    name={item.name || ''}
                                    quantity={item.quantity}
                                    total={total || 1}
                                    description={item.description}
                                    type='Product'
                                    mode='lineItem'
                                    onDelete={() => deleteItem(item.id)}
                                    onEdit={() => editItem(item)}
                                />
                            )
                        }}>
                    </FlatList>
                </View>

                <Pressable onPress={() => { setVisible(true); setSelectedItem(null); }} style={[styles.addItemContainer, { borderBottomColor: theme.border.secondary }]}>
                    <Text style={[styles.addItem, { color: theme.text.secondary }]}>+ Add New Item</Text>
                </Pressable>

                <View style={styles.statsBox}>
                    <Text style={[styles.subtotal, { color: theme.text.secondary }]}>SUBTOTAL ESTIMATE</Text>
                    <Text style={[styles.totalPrice]}>${subTotal}</Text>
                </View>

                <SelectProduct visible={visible} onClose={() => setVisible(false)} onSubmit={handleSubmitItem} selectedItem={selectedItem} />

            </Screen>

            <ScreenFooter leadingButton>
                <SimpleButton btnText='NEXT STEP' onPress={() => { previewInvoice() }} />
            </ScreenFooter>
        </>
    )
}

export default LineItems

const styles = StyleSheet.create({
    title: {
        fontSize: mVs(26),
        fontWeight: 'bold',
        marginTop: mVs(20),
    },
    label: {
        fontSize: mVs(14),
        fontWeight: '500',
        marginTop: mVs(20),
        marginBottom: mVs(3),
    },
    bottomNav: {
        height: 100,
        width: '100%',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        position: 'absolute',
        padding: 16,
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    addItemContainer: {
        marginTop: mVs(20),
        marginHorizontal: mVs(20),
        paddingBottom: mVs(20),
        borderBottomWidth: 1,
    },
    addItem: {
        fontSize: mVs(18),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    subtotal: {
        fontSize: mVs(14),
        fontWeight: 600,
    },
    totalPrice: {
        fontSize: mVs(26),
        fontWeight: 600,
        color: '#00A896'
    },
    statsBox: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        marginHorizontal: mVs(20),
        marginTop: mVs(20),
    },
    backButton: {
        height: mVs(50),
        width: mVs(90),
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    back: {
        fontSize: mVs(18),
        fontWeight: 'bold',
    },
    dummyText: {
        textAlign: 'center',
        marginTop: 80,
        fontSize: mVs(16),
        fontWeight: 500
    },
    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        marginVertical: 10
    },
})