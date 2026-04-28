import { ScrollScreen } from '@/src/components/layout'
import ModalWrapper from '@/src/components/layout/modal-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { generateInvoiceNumber, setInvoiceDraft, setInvoiceNumber } from '@/src/redux/slices/invoiceSlice'
import { RootState } from '@/src/redux/store/myStore'
import { loadClients } from '@/src/redux/thunks/client-thunk'
import { validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { addDays, format } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ErrorText from '../components/error-text'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'


const AddInvoice = () => {

    const termKeyMap: Record<string, string> = {
        'Due on receipt': 'dueOnReceipt',
        'Net 7': 'net7',
        'Net 15': 'net15',
        'Net 30': 'net30',
    };

    const { theme } = useTheme();
    const { t } = useTranslation();
    const formikRef = useRef<any>(null);
    const paymentOptions = ['Due on receipt', 'Net 7', 'Net 15', 'Net 30'];
    const invoiceNumber = useSelector((state: RootState) => state.invoiceReducer.currentInvoiceNumber);
    const clients = useSelector((state: RootState) => state.clientsReducer.clients ?? []);
    const dispatch = useDispatch();
    const { editable } = useLocalSearchParams();
    const isEditable = editable === 'true';
    const invoice = useSelector((state: RootState) => state.invoicesListReducer.selectedInvoice);

    const [issueDatePicker, setIssueDatePicker] = useState(false);
    const [dueDatePicker, setDueDatePicker] = useState(false);
    const [openPaymentList, setOpenPaymentList] = useState(false);
    const [openClientModal, setOpenClientModal] = useState(false);

    useEffect(() => {
        dispatch(loadClients() as any);
    }, []);

    useEffect(() => {
        if (editable) return;
        const fetchLastInvoiceNumber = async () => {
            const lastInvoice = await AsyncStorage.getItem('lastInvoiceNumber');
            const lastNumber = lastInvoice ? parseInt(lastInvoice.split('-')[1]) : 0;
            const newNumber = generateInvoiceNumber(lastNumber);

            dispatch(setInvoiceNumber(newNumber));
        };

        fetchLastInvoiceNumber();
    }, [editable]);

    const initialValues = {
        clientId: isEditable ? invoice?.client?.id || '' : '',
        clientName: isEditable ? invoice?.client?.name || '' : '',
        invoiceNumber: isEditable ? invoice?.invoiceNumber || invoiceNumber || 'INV-0001' : invoiceNumber || 'INV-0001',
        issueDate: isEditable ? invoice?.issueDate || '' : '',
        dueDate: isEditable ? invoice?.dueDate || '' : '',
        paymentTerms: isEditable ? invoice?.paymentTerms || '' : '',
    };

    const handleAutoDueDate = (issueDateIso: string, paymentTerm: string) => {
        if (!issueDateIso) return;
        const issueDate = new Date(issueDateIso);
        let daysToAdd = 0;

        switch (paymentTerm) {
            case 'Net 7':
                daysToAdd = 7;
                break;

            case 'Net 15':
                daysToAdd = 15;
                break;

            case 'Net 30':
                daysToAdd = 30;
                break;

            case 'Due on receipt':
            default:
                daysToAdd = 0;
        }

        return addDays(issueDate, daysToAdd).toISOString();
    };


    return (
        <>
            <ScrollScreen >

                <AuthHeader arrowBack title={t('invoice.step1')} />

                <View style={{ flex: 1, backgroundColor: theme.background.primary, }}>

                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema.clientDetails}
                        onSubmit={async (values: any) => {
                            dispatch(setInvoiceDraft({
                                clientId: values.clientId,
                                issueDate: values.issueDate,
                                dueDate: values.dueDate,
                                invoiceNumber: values.invoiceNumber,
                            }))
                            router.push('/screens/line-items');
                        }} >

                        {({ errors, touched, setFieldValue, values }: any) => (
                            <View style={{ paddingHorizontal: 16 }}>
                                <Text style={[styles.title, { color: theme.text.primary }]} >{t('invoice.clientDetails')}</Text>

                                <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.SelectClient')}</Text>
                                <Pressable onPress={() => setOpenClientModal(!openClientModal)}>
                                    <InputTab icon={<Ionicons name='people-outline' size={25} color={theme.text.secondary} />} placeholder={t('invoice.selectClient')} value={values.clientName} editable={false} />
                                </Pressable>
                                {touched.clientName && errors.clientName && (<ErrorText errorText={errors.clientName} />)}
                                <ModalWrapper visible={openClientModal} onClose={() => { setOpenClientModal(false) }} searchBar
                                    data={clients ?? []} labelKey='clientName' valueKey='id' modalTitle={t('invoice.selectClient')}
                                    onItemPress={(item) => { setFieldValue('clientId', item.id); setFieldValue('clientName', item.clientName) }} />

                                <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.InvoiceNumber')}</Text>
                                <InputTab placeholder={t('invoice.invoiceNumber')} value={values.invoiceNumber} editable={false} />
                                {touched.invoiceNumber && errors.invoiceNumber && (<ErrorText errorText={errors.invoiceNumber} />)}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.IssueDate')}</Text>
                                        <Pressable onPress={() => setIssueDatePicker(true)} >
                                            <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder={t('invoice.issueDate')} value={values.issueDate ? format(new Date(values.issueDate), 'dd-MM-yyyy') : ''} editable={false} />
                                            {touched.issueDate && errors.issueDate && (<ErrorText errorText={errors.issueDate} />)}
                                        </Pressable>
                                        {issueDatePicker && (
                                            <DateTimePicker
                                                value={values.issueDate ? new Date(values.issueDate) : new Date()}
                                                mode='date'
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={(event, selectedDate) => {
                                                    setIssueDatePicker(false);
                                                    if (event.type === 'dismissed') return;
                                                    if (selectedDate) {
                                                        setFieldValue('issueDate', format(new Date(selectedDate), 'yyyy-MM-dd'));
                                                    };
                                                }}
                                            />
                                        )}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.DueDate')}</Text>
                                        <Pressable onPress={() => setDueDatePicker(true)}>
                                            <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder={t('invoice.dueDate')} value={values.dueDate ? format(new Date(values.dueDate), 'dd-MM-yyyy') : ''} editable={false} />
                                            {touched.dueDate && errors.dueDate && (<ErrorText errorText={errors.dueDate} />)}
                                        </Pressable>
                                        {dueDatePicker && (
                                            <DateTimePicker
                                                value={values.dueDate ? new Date(values.dueDate) : new Date()}
                                                mode='date'
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={(event, selectedDate) => {
                                                    setDueDatePicker(false);
                                                    if (event.type === 'dismissed') return;

                                                    if (selectedDate) setFieldValue('dueDate', format(new Date(selectedDate), 'yyyy-MM-dd'));
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>

                                <Text style={[styles.label, { color: theme.text.secondary }]}>{t('invoice.PaymentTerms')}</Text>
                                <Pressable onPress={() => setOpenPaymentList(!openPaymentList)}>
                                    <InputTab icon={<Ionicons name='chevron-down' color={theme.text.secondary} size={24} />} placeholder={t('invoice.paymentTerms')} value={values.paymentTerms} editable={false} />
                                    {touched.paymentTerms && errors.paymentTerms && (<ErrorText errorText={errors.paymentTerms} />)}
                                </Pressable>
                                {openPaymentList && (
                                    <View style={[styles.dropdownContainer, { borderColor: theme.border.secondary }]}>
                                        {paymentOptions.map((term) => (
                                            <Pressable key={term} style={[styles.dropdownItem, { borderBottomColor: theme.border.secondary }]} onPress={() => {
                                                setFieldValue('paymentTerms', term);
                                                setOpenPaymentList(false);
                                                setFieldValue('dueDate', handleAutoDueDate(values.issueDate, term))
                                            }}>
                                                <Text style={[styles.terms, { color: theme.text.primary }]}>{t(`paymentTerms.${termKeyMap[term]}`, term)}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}


                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollScreen>
            <ScreenFooter>
                <SimpleButton btnText={t('common.nextStep')} onPress={() => { formikRef.current?.handleSubmit() }} />
            </ScreenFooter>
        </>
    )
}

export default AddInvoice

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
        justifyContent: 'center',
        borderTopWidth: 1,
        position: 'absolute',
        padding: 16,
        bottom: 0,
        right: 0,
        left: 0
    },
    dropdownContainer: {
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    terms: {
        fontSize: mVs(16),
        fontWeight: 500
    }
})