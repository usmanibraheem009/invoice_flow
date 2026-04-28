import { Screen } from '@/src/components/layout'
import { useTheme } from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

const reports = () => {

  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.text, { color: theme.text.primary }]}>{t('common.underDevelopment')}</Text>
      </View>
    </Screen>
  )
}

export default reports

const styles = StyleSheet.create({
  text: {
    fontSize: mVs(18)
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: mVs(20)
  }
})