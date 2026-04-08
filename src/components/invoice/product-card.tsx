import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface InvoiceItem {
    id: string,
    name: string,
    description?: string,
    unitPrice?: string,
    price?: number,
    quantity?: number,
    total?: number,
    type: 'Product' | 'Service',
    onDelete: (id: string) => void,
    onEdit: (item: InvoiceItem) => void
}

const ProductCard = ({ name, price, quantity, total, type, id, onDelete, onEdit, unitPrice, description }: InvoiceItem) => {

    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
            <View style={styles.leftContainer}>
                <Text style={[styles.title, { color: theme.text.primary }]}>{name}</Text>
                {description && (
                    <Text style={[styles.description, { color: theme.text.primary }]}>{description}</Text>
                )}
                {quantity ? (
                    <Text style={[styles.date, { color: theme.text.secondary }]}>{type === 'Product' ? `${quantity} X ${price}` : `${quantity} h X ${price}`}</Text>
                ) : (
                    <Text style={[styles.price, { color: theme.text.secondary }]}>{type === 'Product' ? `unit price: $ ${unitPrice}`: `price per hour: $ ${unitPrice}` }</Text>
                )}

                {total && (
                    <Text style={[styles.price, { color: theme.text.primary }]}>${total}</Text>
                )}
            </View>

            <View style={styles.rightContainer}>
                <Ionicons name='trash-outline' color={'red'} size={20} onPress={() => onDelete(id)} />
                <Ionicons name='pencil' color={theme.text.secondary} size={20} onPress={() => onEdit({ id, name, price, quantity, total, type, onDelete, onEdit, description, unitPrice })} />
            </View>
        </View>
    )
}

export default ProductCard

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
        maxWidth: 200
    },
    date: {
        fontSize: mVs(12),
        fontWeight: 400,
        color: '#B0B8C1'
    },
    price: {
        fontSize: mVs(14),
        fontWeight: 500,
    },
    rightContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: mVs(10)
    },
    leftContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: mVs(6)
    },
    editText: {
        fontSize: mVs(12),
        fontWeight: 500,
        alignSelf: 'center',
        marginBottom: mVs(10)
    },
    description: {
        fontSize: mVs(14),
        fontWeight: 400,
        maxWidth: mVs(200)
    }
})