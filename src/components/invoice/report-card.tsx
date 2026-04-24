import { useTheme } from '@/src/hooks/useTheme'
import { secondary } from '@/src/theme/colors'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

interface revenueCardProps {
    title?: string,
    amount?: number,
    status?: string,
    ratio?: string,
}

const ReportCard = ({ title, amount, status, ratio }: revenueCardProps) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
            <Text style={[styles.title, { color: theme.text.secondary }]}>{title || `${t('common.revenue')}`}</Text>
            <Text style={[styles.price, { color: theme.text.primary }]}>${amount || '0'}</Text>
            <Text style={[styles.ratio, { color: secondary[50] }]}>{ratio || '12.5%'}</Text>
        </View>
    )
}

export default ReportCard

const styles = StyleSheet.create({
    container: {
        height: mVs(110),
        width: mVs(140),
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        gap: 6
    },
    title: {
        fontSize: mVs(14),
        fontWeight: 500,
        color: '#b8b0c1',
    },
    price: {
        fontSize: mVs(20),
        fontWeight: 'bold',
    },
    ratio: {
        fontSize: mVs(14),
        fontWeight: 'bold',
    }

})