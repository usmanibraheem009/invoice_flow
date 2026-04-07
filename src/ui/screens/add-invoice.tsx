import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { setInvoiceNumber } from '@/src/redux/slices/invoiceSlice'
import { validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import { addDays, format } from 'date-fns'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ErrorText from '../components/error-text'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'


const generateInvoiceNumber = (lastNumber: number = 0) => {
    const nextNumber = lastNumber + 1;
    return `INV-${String(nextNumber).padStart(4, '0')}`;
}

const AddInvoice = () => {

    const { theme } = useTheme();
    const formikRef = useRef<any>(null);
    const paymentOptions = ['Due on Receipt', 'Net 7', 'Net 15', 'Net 30'];
    const invoiceNumber = useSelector((state: any) => state.invoiceReducer.currentInvoiceNumber);
    const dispatch = useDispatch();

    const [issueDatePicker, setIssueDatePicker] = useState(false);
    const [dueDatePicker, setDueDatePicker] = useState(false);
    const [openPaymentList, setOpenPaymentList] = useState(false);

    useEffect(() => {
        const fetchLastInvoiceNumber = async () => {
            const lastInvoice = await AsyncStorage.getItem('lastInvoiceNumber');
            const lastNumber = lastInvoice ? parseInt(lastInvoice.split('-')[1]) : 0;
            const newNumber = generateInvoiceNumber(lastNumber);

            dispatch(setInvoiceNumber(newNumber));
        };

        fetchLastInvoiceNumber();
    }, []);

    const initialValues = {
        clientName: '',
        invoiceNumber: invoiceNumber || 'INV-0001',
        issueDate: '',
        dueDate: '',
        paymentTerms: '',
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
            <ScreenWrapper scrollable keyboardAvoidingView >

                <AuthHeader arrowBack title='Step 1 of 3' />

                <View style={{ flex: 1, backgroundColor: theme.background.primary, }}>

                    <Formik
                        innerRef={formikRef}
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={validationSchema.clientDetails}
                        onSubmit={async (values: any) => {
                            router.push({
                                pathname: '/screens/line-items',
                                params: { invoiceData: JSON.stringify(values) }
                            });
                            await AsyncStorage.setItem('lastInvoiceNumber', values.invoiceNumber);
                        }} >

                        {({ errors, touched, handleChange, setFieldValue, values }: any) => (
                            <View style={{ paddingHorizontal: 16 }}>
                                <Text style={[styles.title, { color: theme.text.primary }]} > Client & Details </Text>
                                <Text style={[styles.label, { color: theme.text.secondary }]}> SELECT CLIENT </Text>
                                <InputTab icon={<Ionicons name='people-outline' size={25} color={theme.text.secondary} onPress={() => { }} />} placeholder='Search or select...' value={values.clientName} onChangeText={handleChange('clientName')} />
                                {touched.clientName && errors.clientName && (<ErrorText errorText={errors.clientName} />)}

                                <Text style={[styles.label, { color: theme.text.secondary }]}> INVOICE NUMBER </Text>
                                <InputTab placeholder='Invoice Number' value={values.invoiceNumber} editable={false} />
                                {touched.invoiceNumber && errors.invoiceNumber && (<ErrorText errorText={errors.invoiceNumber} />)}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, { color: theme.text.secondary }]}>ISSUE DATE </Text>
                                        <Pressable onPress={() => setIssueDatePicker(true)} >
                                            <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder='Issue Date' value={values.issueDate ? format(new Date(values.issueDate), 'dd-MM-yyyy') : ''} editable={false} />
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
                                                        setFieldValue('issueDate', selectedDate);
                                                    };
                                                }}
                                            />
                                        )}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.label, { color: theme.text.secondary }]}> DUE DATE </Text>
                                        <Pressable onPress={() => setDueDatePicker(true)}>
                                            <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder='Due Date' value={values.dueDate ? format(new Date(values.dueDate), 'dd-MM-yyyy') : ''} editable={false} />
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

                                                    if (selectedDate) setFieldValue('dueDate', selectedDate);
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>

                                <Text style={[styles.label, { color: theme.text.secondary }]}>PAYMENT TERMS</Text>
                                <Pressable onPress={() => setOpenPaymentList(!openPaymentList)}>
                                    <InputTab icon={<Ionicons name='chevron-down' color={theme.text.secondary} size={24} />} placeholder='Payment Terms' value={values.paymentTerms} editable={false} />
                                    {touched.paymentTerms && errors.paymentTerms && (<ErrorText errorText={errors.paymentTerms} />)}
                                </Pressable>
                                {openPaymentList && (
                                    <View style={styles.dropdownContainer}>
                                        {paymentOptions.map((term) => (
                                            <Pressable key={term} style={styles.dropdownItem} onPress={() => {
                                                setFieldValue('paymentTerms', term);
                                                setOpenPaymentList(false);
                                                setFieldValue('dueDate', handleAutoDueDate(values.issueDate, term))
                                            }}>
                                                <Text>{term}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}


                            </View>
                        )}
                    </Formik>
                </View>
            </ScreenWrapper>
            <ScreenFooter>
                <SimpleButton btnText='NEXT STEP' onPress={() => { formikRef.current?.handleSubmit() }} />
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
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
})