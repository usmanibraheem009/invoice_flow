import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface buttonProps{
    btnText: React.ReactNode,
    onPress: () => void,
    disabled?: boolean,
}

const SimpleButton = ({btnText, onPress, disabled = false} : buttonProps) => {

  const {theme} = useTheme();

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: theme.surface.primary}]} onPress={onPress} disabled={disabled}>
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