import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const InvoiceStatus = () => {
    const {theme} = useTheme();

  return (
    <View style={[styles.container,{borderColor: theme.border.primary}]}>
      <Text style={[styles.text, {color: '#2DC653'}]}>Pending</Text>
    </View>
  )
}

export default InvoiceStatus

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: mVs(90),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .7,
        borderRadius: mVs(20),
        backgroundColor: 'transparent'
    },
    text: {
        fontSize: mVs(14),
        fontWeight: 'bold',
        color: 'white'
    }
})