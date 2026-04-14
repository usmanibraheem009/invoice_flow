import UserAvatar from '@/src/components/client/user-avatar'
import InvoiceStatus from '@/src/components/invoice/invoice-status'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import { useTheme } from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AuthHeader from '../components/screen-header'

interface InvoiceDetailsProps {
    invoiceNumber: string,
    clientName: string,
    clientEmail: string,
    invoiceStatus: string,
    issueDate: string,
    dueDate: string,
}

const InvoiceDetails = ({ invoiceNumber, clientName, clientEmail, invoiceStatus, issueDate, dueDate }: InvoiceDetailsProps) => {

    const { theme } = useTheme();

    return (
        <ScreenWrapper>
            <AuthHeader arrowBack title={invoiceNumber || 'INV-0001'} trailingIcon='ellipsis-vertical' />
            <View style={[styles.container, { borderColor: theme.border.secondary, backgroundColor: theme.background.secondary }]}>

                <View style={[styles.header, { borderBottomColor: theme.border.secondary }]}>
                    <UserAvatar name={clientName || 'Usman Ibraheem'} />
                    <View>
                        <Text style={[styles.clientName, { color: theme.text.primary }]}>{clientName || 'Usman Ibraheem'}</Text>
                        <Text style={[styles.clientEmail, { color: theme.text.secondary }]}>{clientEmail || 'billing@acme.com'}</Text>
                    </View>
                    <InvoiceStatus status={invoiceStatus || 'PAID'} />
                </View>


                <View style={[styles.dateSection, {borderBottomColor: theme.border.secondary}]}>
                    <View style={{gap: mVs(10)}}>
                        <Text style={[styles.dateType, { color: theme.text.primary }]}>ISSUE DATE</Text>
                        <Text style={[styles.date, { color: theme.text.primary }]}>{issueDate || 'Oct 23, 2024'}</Text>
                    </View>

                    <View style={{gap: mVs(10)}}>
                        <Text style={[styles.dateType, { color: theme.text.primary }]}>DUE DATE</Text>
                        <Text style={[styles.date, { color: theme.text.primary }]}>{dueDate || 'Oct 23, 2024'}</Text>
                    </View>
                </View>


                <View>
                    
                </View>
            </View>
        </ScreenWrapper>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: mVs(12),
        borderBottomWidth: 1.5,
        paddingBottom: mVs(20)
    },
    clientName: {
        fontSize: mVs(16),
        fontWeight: 'bold'
    },
    clientEmail: {
        fontSize: mVs(12),
        fontWeight: 400
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
    }
})