import { secondary } from '@/src/theme/colors';
import { mVs } from '@/src/utils/scale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface statusProps{
  status?: string,
}

const InvoiceStatus = ({status}: statusProps) => {

  const borderColors: Record<string, string> = {
    PAID: secondary[50] || '#2DC653',
    PENDING: secondary[100] || '#F4A261',
    OVERDUE: secondary[200] || '#E63946',
    DRAFT: secondary[300] || '#6B7685',
  }

  return (
    <View style={[styles.container,{borderColor: borderColors[status as keyof typeof borderColors] || secondary[200]}]}>
      <Text style={[styles.text, {color: borderColors[status as keyof typeof borderColors]}]}>{status}</Text>
    </View>
  )
}

export default InvoiceStatus

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: mVs(90),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: mVs(20),
        backgroundColor: 'transparent'
    },
    text: {
        fontSize: mVs(14),
        fontWeight: 'bold',
        color: 'white'
    }
})