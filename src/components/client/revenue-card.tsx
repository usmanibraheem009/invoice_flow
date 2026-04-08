import useTheme from '@/src/hooks/useTheme'
import { secondary } from '@/src/theme/colors'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface revenueCardProps{
    title?: string,
    amount?: number,
    status?: string,
}

const RevenueCard = ({title, amount, status}: revenueCardProps) => {
    const {theme} = useTheme();

  return (
    <View style={[ styles.container,{backgroundColor: theme.background.secondary, borderColor: theme.border.primary}]}>
      <Text style={[styles.title,{color: theme.text.secondary}]}>{title}</Text>
      <Text style={[styles.price, {color: status=== 'PAID'? secondary[50] : secondary[200]}]}>$ {amount}</Text>
    </View>
  )
}

export default RevenueCard

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: 'auto',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: 'center',
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