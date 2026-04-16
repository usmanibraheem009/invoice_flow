import UserAvatar from '@/src/components/client/user-avatar'
import InvoiceStatus from '@/src/components/invoice/invoice-status'
import { Screen, ScrollScreen } from '@/src/components/layout'
import LoadingIndicator from '@/src/components/layout/loading-indicator'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { fetchInvoiceById } from '@/src/redux/slices/invoiceListSlice'
import { RootState } from '@/src/redux/store/myStore'
import { dateformatter } from '@/src/utils/date-formatter'
import { formatCurrency } from '@/src/utils/helper'
import { selectEnrichedInvoiceById } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IconButton, Menu } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'


const InvoiceDetails = () => {

    const { theme } = useTheme();
    const { invoiceId } = useLocalSearchParams();
    const dispatch = useDispatch<any>();
    const selectedInvoice = useSelector((state: RootState) => state.invoicesListReducer.selectedInvoice);
    const enrichedInvoice = useSelector(selectEnrichedInvoiceById(invoiceId as string));
    console.log('enriched invoice data: ', enrichedInvoice);


    const [showDropDown, setShowDropDown] = useState(false);
    const openMenu = () => { setShowDropDown(true) };
    const closeMenu = () => { setShowDropDown(false) };

    const total = selectedInvoice?.lineItems?.reduce((sum: number, item: any) => {
        const qty = Number(item?.quantity ?? 0);
        const price = Number(item?.unitPrice ?? 0);

        return sum + qty * price;
    }, 0) ?? 0;

    useEffect(() => {
        if (invoiceId) {
            dispatch(fetchInvoiceById(invoiceId as string));
        }
        return;
    }, [invoiceId]);

    const onEdit = async () => {

    };

    const onDelete = async () => {

    };

    if (!selectedInvoice) {
        return (
            <Screen>
                <LoadingIndicator />
            </Screen>
        );
    }

    return (
        <>
            <ScrollScreen>
                <AuthHeader arrowBack title={selectedInvoice.invoiceNumber || 'INV-0001'} trailingComponent={
                    <Menu visible={showDropDown} anchor={<IconButton icon={'dots-vertical'} onPress={() => openMenu()} />}>
                        <Menu.Item title='Edit' onPress={() => { onEdit(); closeMenu() }} />
                        <Menu.Item title='Delete' onPress={() => { onDelete(); closeMenu() }} />
                    </Menu>
                } />
                <View style={[styles.container, { borderColor: theme.border.secondary, backgroundColor: theme.background.secondary }]}>

                    <View style={[styles.header, { borderBottomColor: theme.border.secondary }]}>
                        <UserAvatar name={enrichedInvoice?.clientName} />
                        <View style={{ maxWidth: mVs(150) }}>
                            <Text style={[styles.clientName, { color: theme.text.primary }]}>{enrichedInvoice?.clientName || 'dummy user'}</Text>
                            <Text style={[styles.clientEmail, { color: theme.text.secondary }]}>{enrichedInvoice?.clientEmail || 'billing@acme.com'}</Text>
                        </View>
                        <InvoiceStatus status={selectedInvoice.status} />
                    </View>


                    <View style={[styles.dateSection, { borderBottomColor: theme.border.secondary }]}>
                        <View style={{ gap: mVs(10) }}>
                            <Text style={[styles.dateType, { color: theme.text.primary }]}>ISSUE DATE</Text>
                            <Text style={[styles.date, { color: theme.text.primary }]}>{dateformatter(selectedInvoice.issueDate)}</Text>
                        </View>

                        <View style={{ gap: mVs(10) }}>
                            <Text style={[styles.dateType, { color: theme.text.primary }]}>DUE DATE</Text>
                            <Text style={[styles.date, { color: theme.text.primary }]}>{dateformatter(selectedInvoice.dueDate)}</Text>
                        </View>
                    </View>


                    <View style={[styles.lineItemsContainer, { borderBottomColor: theme.border.secondary }]}>
                        {enrichedInvoice.lineItems?.map((item: any) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}>{item.productName} ({item.quantity})</Text>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}></Text>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}>{formatCurrency(item.amount, enrichedInvoice?.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalContainer}>
                        <Text style={[styles.totalText, { color: theme.text.primary }]}>Total</Text>
                        <Text style={[styles.totalText, { color: theme.surface.primary }]}>{formatCurrency(total, enrichedInvoice?.currency)}</Text>
                    </View>
                </View>

            </ScrollScreen>

            <ScreenFooter leadingButton handleDownload={() => {
                router.push({
                    pathname: '/screens/template-screen',
                    params: { invoiceId: enrichedInvoice.id }
                })
            }}>
                <SimpleButton btnText='SEND NOW' onPress={() => { }} />
            </ScreenFooter>
        </>
    )
}

export default InvoiceDetails

const styles = StyleSheet.create({
    container: {
        margin: mVs(20),
        borderWidth: 1.5,
        padding: mVs(20),
        borderRadius: mVs(20)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: mVs(12),
        borderBottomWidth: 1.5,
        paddingBottom: mVs(20),
    },
    clientName: {
        fontSize: mVs(16),
        fontWeight: 'bold'
    },
    clientEmail: {
        fontSize: mVs(12),
        fontWeight: 400,
    },
    dateType: {
        fontSize: mVs(14),
        fontWeight: 400,
    },
    date: {
        fontSize: mVs(14),
        fontWeight: 'bold'
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: mVs(20),
        paddingBottom: mVs(20),
        borderBottomWidth: 1.5,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lineItem: {
        fontSize: mVs(16),
        fontWeight: 500
    },
    lineItemsContainer: {
        marginTop: mVs(20),
        gap: mVs(10),
        borderBottomWidth: 1.5,
        paddingBottom: mVs(20)
    },
    totalText: {
        fontSize: mVs(24),
        fontWeight: 'bold'
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: mVs(20),
        paddingBottom: mVs(10)
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: mVs(60),
    },
    downloadButton: {
        height: mVs(60),
        width: mVs(60),
        borderRadius: mVs(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdfText: {
        fontSize: mVs(14),
        fontWeight: 500
    }
})