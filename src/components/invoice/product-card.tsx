import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface productCardProps{
    title: string,
    price: number,
    hours: number
}

const ProductCard = ({title, price, hours }: productCardProps) => {

    const { theme } = useTheme();
    const totalPrice = price * hours;

    return (
        <View style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
            <View style={styles.leftContainer}>
                <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
                <Text style={[styles.date, { color: theme.text.secondary }]}>{hours} X {price}</Text>
            </View>

            <View style={styles.rightContainer}>
                <Text style={[styles.price, { color: theme.text.primary }]}>${totalPrice}</Text>
                <Ionicons name='trash-outline' color={'red'} size={20} onPress={() => {}}/>
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