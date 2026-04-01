import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { initialValues, validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ErrorText from '../components/error-text'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const AddInvoice = () => {

    const { theme } = useTheme();

    const submitFunc = async () => {
        // handle submit
    };

    return (
        <ScreenWrapper scrollable keyboardAvoidingView >

            <AuthHeader arrowBack title='Step 1 of 3' />

            <View style={{ flex: 1, backgroundColor: theme.background.primary, }}>
                <Formik initialValues={initialValues.clientDetails} validationSchema={validationSchema.clientDetails} onSubmit={submitFunc} >
                    {({ errors, touched, handleChange, handleSubmit, values }: any) => (
                        <View style={{ paddingHorizontal: 16 }}>
                            <Text style={[styles.title, { color: theme.text.primary }]} > Client & Details </Text>
                            <Text style={[styles.label, { color: theme.text.secondary }]}> SELECT CLIENT </Text>
                            <InputTab icon={<Ionicons name='people-outline' size={25} color={theme.text.secondary} onPress={() => { router.push('/(tabs)/invoices') }} />} placeholder='Search or select...' value={values.clientName} onChangeText={handleChange('clientName')} />
                            {touched.clientName && errors.clientName && (<ErrorText errorText={errors.clientName} />)}

                            <Text style={[styles.label, { color: theme.text.secondary }]}> INVOICE NUMBER </Text>
                            <InputTab placeholder='Invoice Number' value={values.invoiceNumber} onChangeText={handleChange('invoiceNumber')} />
                            {touched.invoiceNumber && errors.invoiceNumber && (<ErrorText errorText={errors.invoiceNumber} />)}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { color: theme.text.secondary }]}>ISSUE DATE </Text>
                                    <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder='Issue Date' value={values.issueDate} onChangeText={handleChange('issueDate')} />
                                    {touched.issueDate && errors.issueDate && (<ErrorText errorText={errors.issueDate} />)}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { color: theme.text.secondary }]}> DUE DATE </Text>
                                    <InputTab icon={<Ionicons name='calendar-number' color={theme.text.secondary} size={24} />} placeholder='Due Date' value={values.dueDate} onChangeText={handleChange('dueDate')} />
                                    {touched.dueDate && errors.dueDate && (<ErrorText errorText={errors.dueDate} />)}
                                </View>
                            </View>

                            <Text style={[styles.label, { color: theme.text.secondary }]}>PAYMENT TERMS</Text>
                            <InputTab icon={<Ionicons name='chevron-down' color={theme.text.secondary} size={24} />} placeholder='Payment Terms' value={values.paymentTerms} onChangeText={handleChange('paymentTerms')} />
                            {touched.paymentTerms && errors.paymentTerms && (<ErrorText errorText={errors.paymentTerms} />)}

                        </View>
                    )}
                </Formik>
                <ScreenFooter>
                    <SimpleButton btnText='NEXT STEP' onPress={() => { router.push('/screens/line-items') }} />
                </ScreenFooter>
            </View>
        </ScreenWrapper>
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
    }
})