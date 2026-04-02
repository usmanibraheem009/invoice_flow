import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthHeaderProps {
  children: React.ReactNode,
  backButton?: boolean,
}

const ScreenFooter = ({ children, backButton }: AuthHeaderProps) => {

  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background.secondary, borderTopColor: theme.border.primary }]}>
      {backButton && (
        <TouchableOpacity style={[styles.backButton, { borderColor: theme.text.primary }]} onPress={() => { router.back() }}>
        <Text style={[styles.back, { color: theme.text.primary }]}>Back</Text>
      </TouchableOpacity>
      )}

      <View style={{ flex: 8 }}>
        {children}
      </View>
    </View>
  )
}

export default ScreenFooter

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    // position: 'absolute',
    padding: 16,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  backButton: {
    height: mVs(50),
    width: mVs(90),
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  back: {
    fontSize: mVs(18),
    fontWeight: 'bold',
  }
})