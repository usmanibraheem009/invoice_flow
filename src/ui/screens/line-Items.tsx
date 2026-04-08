import ProductCard, { InvoiceItem } from '@/src/components/invoice/product-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import SelectProduct from '@/src/components/modals/select-product'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const LineItems = () => {

    const { theme } = useTheme();
    const { invoiceData } = useLocalSearchParams<{ invoiceData: any }>();
    const parsedInvoiceData = invoiceData ? JSON.parse(invoiceData) : null;
    const products = useSelector((state: any) => state.productsReducer.products);
    console.log(products)

    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<InvoiceItem | null>(null);

    const handleSubmitItem = (newItem: InvoiceItem) => {
        if (selectedItem) {
            setItems(prev => prev.map(item => item.id === selectedItem.id ? newItem : item))
        }
        else {
            setItems((prev: any[]) => [...prev, newItem])
        }
        setSelectedItem(null);
    };

    const deleteItem = (id: string) => {
        setItems((prev: any[]) => prev.filter(item => item.id !== id));
    };

    const editItem = (item: InvoiceItem) => {
        setSelectedItem(item);
        setVisible(true);
    }

    const subTotal = items.reduce((sum, item) => sum + item.total!, 0);

    const previewInvoice = () => {

        if (items.length === 0) {
            Alert.alert('Warning', 'Please add at least one item');
            return;
        };

        const fullInvoiceDate = {
            ...parsedInvoiceData,
            items,
            subTotal
        };

        router.push({
            pathname: '/screens/preview-screen',
            params: { invoiceData: JSON.stringify(fullInvoiceDate) }
        });
    };

    return (
        <>
            <ScreenWrapper keyboardAvoidingView >
                <AuthHeader arrowBack title='Step 2 of 3' />

                <View style={{ flex: 1, backgroundColor: theme.background.primary, paddingHorizontal: 20, maxHeight: 500 }}>
                    <Text style={[styles.title, { color: theme.text.primary }]} > Line Items </Text>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ gap: 12, marginTop: 20, paddingBottom: 20 }}
                        ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}> No items added yet </Text>)}
                        renderItem={({ item }) => {
                            return (
                                <ProductCard
                                    id={item.id}
                                    name={item.name}
                                    price={item.price}
                                    quantity={item.quantity}
                                    total={item.total}
                                    type={item.type}
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

                <SelectProduct visible={visible} onClose={() => setVisible(false)} onSubmit={() => {}} />

            </ScreenWrapper>

            <ScreenFooter backButton>
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