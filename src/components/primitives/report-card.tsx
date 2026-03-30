import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ReportCard = () => {
    const {theme} = useTheme();

  return (
    <View style={[ styles.container,{backgroundColor: theme.background.secondary, borderColor: theme.border.primary}]}>
      <Text style={styles.title}>REVENUE</Text>
      <Text style={[styles.price, {color: theme.text.primary}]}>$24850</Text>
      <Text style={styles.ratio}>12.5%</Text>
    </View>
  )
}

export default ReportCard

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '40%',
        padding: 20,
        borderRadius: 10,
        borderWidth: .7,
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
        fontSize: mVs(12),
        fontWeight: 400,
        color: 'yellow'
    }

})