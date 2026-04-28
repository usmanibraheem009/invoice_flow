import { useTheme } from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { useSelector } from 'react-redux'

interface buttonProps {
  btnText: React.ReactNode,
  onPress: () => void,
  disabled?: boolean,
  backgroundColor?: string,
}

const SimpleButton = ({ btnText, onPress, disabled = false, backgroundColor }: buttonProps) => {

  const { theme } = useTheme();
  const loading = useSelector((state: any) => state.loadingReducer.loading);

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: backgroundColor ?? theme.surface.primary }]} onPress={onPress} disabled={disabled}>
      <Text style={styles.btnText}>{loading ? <ActivityIndicator color='white' size={mVs(40)} /> : btnText}</Text>
    </TouchableOpacity>
  )
}

export default SimpleButton

const styles = StyleSheet.create({
  container: {
    height: mVs(50),
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: mVs(18),
    fontWeight: 600,
    color: '#ffff'
  }
})