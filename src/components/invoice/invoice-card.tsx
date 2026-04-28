import { useCurrency } from '@/src/hooks/useCurrency'
import { useTheme } from '@/src/hooks/useTheme'
import { formatCurrency } from '@/src/utils/helper'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import InvoiceStatus from './invoice-status'


interface invoiceCardProps {
    invoiceNumber?: string,
    title?: string,
    price?: number,
    status?: string,
    issueDate?: string,
    totalPrice?: string,
    onPress?: () => void
}

const InvoiceCard = ({ title, status, price, issueDate, onPress, invoiceNumber }: invoiceCardProps) => {

    const { theme } = useTheme();
    const { homeCurrency } = useCurrency();

    return (
        <Pressable style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]} onPress={onPress}>
            <View style={styles.leftContainer}>
                <Text style={[styles.invoiceNo, { color: theme.text.secondary }]}>{invoiceNumber}</Text>
                <Text style={[styles.title, { color: theme.text.primary }]}>{title ?? ''}</Text>
                <Text style={[styles.date, { color: theme.text.secondary }]}>{issueDate}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Text style={[styles.price, { color: theme.text.primary }]}>{formatCurrency(price ?? 0, homeCurrency)}</Text>
                <InvoiceStatus status={status} />
            </View>
        </Pressable>
    )
}

export default InvoiceCard

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        padding: mVs(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    invoiceNo: {
        fontSize: mVs(14),
        fontWeight: 500,
        color: '#B0B8C1'
    },
    title: {
        fontSize: mVs(18),
        fontWeight: 'bold',
    },
    date: {
        fontSize: mVs(12),
        fontWeight: 400,
        color: '#B0B8C1'
    },
    price: {
        fontSize: mVs(20),
        fontWeight: 'bold',
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: mVs(10)
    },
    leftContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: mVs(6)
    }
})