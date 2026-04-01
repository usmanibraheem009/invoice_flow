import useTheme from '@/src/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface FloatingButtonProps{
    icon: React.ComponentProps<typeof Ionicons>['name'],
    onPress: () => void
}

const FloatingButton = ({icon, onPress}: FloatingButtonProps) => {
    const {theme} = useTheme();

  return (
    <TouchableOpacity style={[styles.floatingButton, { backgroundColor: theme.surface.primary }]} onPress={onPress}>
        <Ionicons name={icon} size={30} color={'#ffff'} />
      </TouchableOpacity>
  )
}

export default FloatingButton

const styles = StyleSheet.create({
    floatingButton: {
    height: 60,
    width: 60,
    borderRadius: 60,
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})