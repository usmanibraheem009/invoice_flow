import { useTheme } from '@/src/hooks/useTheme';
import { secondary } from '@/src/theme/colors';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AuthHeaderProps {
  children: React.ReactNode,
  leadingButton?: boolean,
  downloadBtn?: boolean,
  handleDownload?: () => void
}

const ScreenFooter = ({ children, leadingButton, downloadBtn, handleDownload }: AuthHeaderProps) => {

  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background.secondary, borderTopColor: theme.border.primary }]}>
      {leadingButton && (
        <TouchableOpacity style={[styles.leadingButton, { borderColor: theme.text.primary }]} onPress={() => { router.back() }}>
          <Text style={[styles.back, { color: theme.text.primary }]}>Back</Text>
        </TouchableOpacity>
      )}

      {downloadBtn && (
        <TouchableOpacity style={[styles.downloadingButton, { borderColor: theme.border.secondary, backgroundColor: secondary[50] }]} onPress={handleDownload}>
          <Ionicons name='arrow-down' size={mVs(30)} color={theme.text.primary} />
          <Text style={[styles.pdf, { color: theme.text.primary }]}>PDF</Text>
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
  downloadingButton: {
    height: mVs(70),
    width: mVs(70),
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  back: {
    fontSize: mVs(18),
    fontWeight: 'bold',
  },
  pdf: {
    fontSize: mVs(12),
    fontWeight: 500
  },
  leadingButton: {
    height: mVs(50),
    width: mVs(90),
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
})