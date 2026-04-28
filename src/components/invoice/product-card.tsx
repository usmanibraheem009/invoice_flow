import { useCurrency } from '@/src/hooks/useCurrency';
import { useTheme } from '@/src/hooks/useTheme';
import { formatCurrency } from '@/src/utils/helper';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
    id: string,
    name: string,
    quantity?: number;
    unitPrice?: number;
    total?: number;
    description?: string;
    type?: "Product" | "Service";
    mode: "product" | "lineItem";
    onDelete?: (id: string) => void;
    onEdit?: (item: ProductCardProps) => void;
}

const ProductCard = ({ id, name, unitPrice, quantity, total, description, mode, type, onDelete, onEdit }: ProductCardProps) => {

    const { theme } = useTheme();
    const { homeCurrency } = useCurrency();

    return (
        <View style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
            <View style={styles.leftContainer}>

                <Text style={[styles.title, { color: theme.text.primary }]}>{name}</Text>
                {description && (
                    <Text style={[styles.description, { color: theme.text.primary }]}>{description}</Text>
                )}

                {mode === 'lineItem' && quantity && unitPrice && (
                    <Text style={[styles.date, { color: theme.text.secondary }]}>{type === 'Product' ? `${quantity} X ${unitPrice}` : `${quantity} h X ${unitPrice}`}</Text>
                )}

                {mode === 'product' && unitPrice && (
                    <Text style={[styles.price, { color: theme.text.secondary }]}>{type === 'Product' ? `unit price: ${formatCurrency(unitPrice, homeCurrency)}` : `price per hour: ${formatCurrency(unitPrice, homeCurrency)}`}</Text>
                )}

                {total !== undefined && (
                    <Text style={[styles.price, { color: theme.text.primary }]}>{formatCurrency(total, homeCurrency)}</Text>
                )}
            </View>

            <View style={styles.rightContainer}>
                {onDelete && (
                    <Ionicons name="trash-outline" color="red" size={20} onPress={() => onDelete(id)} />
                )}

                {onEdit && (
                    <Ionicons name='pencil' color={theme.text.secondary} size={20} onPress={() => onEdit({ id, name, quantity, total, type, description, unitPrice, mode })} />
                )}

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