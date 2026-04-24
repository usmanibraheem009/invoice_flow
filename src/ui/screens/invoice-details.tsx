import { deleteInvoice } from '@/src/apis/invoiceApi'
import UserAvatar from '@/src/components/client/user-avatar'
import InvoiceStatus from '@/src/components/invoice/invoice-status'
import { Screen, ScrollScreen } from '@/src/components/layout'
import LoadingIndicator from '@/src/components/layout/loading-indicator'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { fetchInvoiceById, removeInvoice } from '@/src/redux/slices/invoiceListSlice'
import { setInvoiceDraft } from '@/src/redux/slices/invoiceSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { AppDispatch, RootState } from '@/src/redux/store/myStore'
import { secondary } from '@/src/theme/colors'
import { dateformatter } from '@/src/utils/date-formatter'
import { formatCurrency } from '@/src/utils/helper'
import { mVs } from '@/src/utils/scale'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { IconButton, Menu } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'


const InvoiceDetails = () => {

    const { theme } = useTheme();
    const { t } = useTranslation();
    const { invoiceId } = useLocalSearchParams();
    console.log("invoice id: ", invoiceId);


    const dispatch = useDispatch<AppDispatch>();
    const selectedInvoice = useSelector((state: RootState) => state.invoicesListReducer.selectedInvoice);
    console.log("selected invoice: ", selectedInvoice);


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

    const mapInvoiceToDraft = (invoice: any) => ({
        invoiceId: invoice.id,
        clientId: invoice.client?.id,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: dateformatter(invoice.issueDate),
        dueDate: dateformatter(invoice.dueDate),
        currency: invoice.currency,
        notes: invoice.notes || "",
        status: invoice.status,
        lineItems: invoice.lineItems?.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            description: item.description,
            unitPrice: Number(item.unitPrice),
            quantity: Number(item.quantity),
            taxRate: Number(item.taxRate ?? 0),
        })) || []
    });

    const onEdit = async () => {
        const mappedDraft = mapInvoiceToDraft(selectedInvoice);
        dispatch(setInvoiceDraft(mappedDraft));
        router.push({ pathname: '/screens/add-invoice', params: { editable: 'true' } });
    };

    const onDelete = async () => {
        Alert.alert(`${t('common.warning')}`, `${t('common.areYouSure', { param: `${t('invoice.title')}` })}`,
            [
                { text: `${t('common.cancel')}`, style: 'cancel', },
                {
                    text: `${t('common.yes')}`, style: 'destructive', onPress: async () => {
                        if (invoiceId) {
                            try {
                                await deleteInvoice(invoiceId as string);
                                router.back();
                                dispatch(removeInvoice(selectedInvoice.id as string));
                                dispatch(showSnackbar({ message: `${t('invoice.invoiceDeleted')}`, type: 'success' }));
                            } catch (error: any) {
                                dispatch(showSnackbar({ message: error?.message || 'Error deleting invoice', type: 'error' }));
                            }
                        }
                    }
                }
            ]
        )
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
                        <Menu.Item title={t('common.edit')} onPress={() => { onEdit(); closeMenu() }} />
                        <Menu.Item title={t('common.delete')} onPress={() => { onDelete(); closeMenu() }} />
                    </Menu>
                } />
                <View style={[styles.container, { borderColor: theme.border.secondary, backgroundColor: theme.background.secondary }]}>

                    <View style={[styles.header, { borderBottomColor: theme.border.secondary }]}>
                        <UserAvatar name={selectedInvoice?.client?.name} />
                        <View style={{ maxWidth: mVs(150) }}>
                            <Text style={[styles.clientName, { color: theme.text.primary }]}>{selectedInvoice?.client?.name || 'dummy user'}</Text>
                            <Text style={[styles.clientEmail, { color: theme.text.secondary }]}>{selectedInvoice?.client?.email || 'billing@acme.com'}</Text>
                        </View>
                        <InvoiceStatus status={selectedInvoice.status} />
                    </View>


                    <View style={[styles.dateSection, { borderBottomColor: theme.border.secondary }]}>
                        <View style={{ gap: mVs(10) }}>
                            <Text style={[styles.dateType, { color: theme.text.primary }]}>{t('invoice.IssueDate')}</Text>
                            <Text style={[styles.date, { color: theme.text.primary }]}>{dateformatter(selectedInvoice.issueDate)}</Text>
                        </View>

                        <View style={{ gap: mVs(10) }}>
                            <Text style={[styles.dateType, { color: theme.text.primary }]}>{t('invoice.DueDate')}</Text>
                            <Text style={[styles.date, { color: theme.text.primary }]}>{dateformatter(selectedInvoice.dueDate)}</Text>
                        </View>
                    </View>


                    <View style={[styles.lineItemsContainer, { borderBottomColor: theme.border.secondary }]}>
                        {selectedInvoice.lineItems?.map((item: any) => (
                            <View key={item.id} style={styles.itemRow}>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}>{item.product.name} ({item.quantity})</Text>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}></Text>
                                <Text style={[styles.lineItem, { color: theme.text.secondary }]}>{formatCurrency(item.amount, selectedInvoice?.currency)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalContainer}>
                        <Text style={[styles.totalText, { color: theme.text.primary }]}>{t('invoice.total')}</Text>
                        <Text style={[styles.totalText, { color: theme.surface.primary }]}>{formatCurrency(total, selectedInvoice?.currency)}</Text>
                    </View>
                </View>

            </ScrollScreen>

            <ScreenFooter handleDownload={() => {
            }}>
                <SimpleButton btnText={t('common.downloadPdf')} onPress={() => {
                    router.push({
                        pathname: '/screens/template-screen',
                        params: { invoiceId: selectedInvoice.id }
                    })
                }} backgroundColor={secondary[50]} />
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