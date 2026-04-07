import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import useTheme from '../../hooks/useTheme'
import { mVs } from '../../utils/scale'

interface contactBtnProps{
    icon: React.ReactNode,
    onPress: () => void
}

const ContactButton = ({icon, onPress}: contactBtnProps) => {

    const {theme} = useTheme();

  return (
    <Pressable style={[styles.container,{backgroundColor: theme.border.primary}]} onPress={onPress}>
      {icon}
    </Pressable>
  )
}

export default ContactButton

const styles = StyleSheet.create({
    container: {
        height: mVs(60),
        width: mVs(60),
        borderRadius: mVs(50),
        justifyContent: 'center',
        alignItems: 'center',
    }
})