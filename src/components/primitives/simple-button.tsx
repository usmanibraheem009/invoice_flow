import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface buttonProps{
    btnText: string,
    onPress: () => void
}

const SimpleButton = ({btnText, onPress} : buttonProps) => {

  const {theme} = useTheme();

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: theme.surface.primary}]} onPress={onPress}>
        <Text style={styles.btnText}>{btnText}</Text>
    </TouchableOpacity>
  )
}

export default SimpleButton

const styles = StyleSheet.create({
    container:{
        height: mVs(50),
        width: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
      fontSize: mVs(18),
      fontWeight:600,
      color: '#ffff'
    }
})