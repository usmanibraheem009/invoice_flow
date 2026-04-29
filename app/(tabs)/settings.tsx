import UserAvatar from '@/src/components/client/user-avatar'
import { ScrollScreen } from '@/src/components/layout'
import SettingsCard from '@/src/components/primitives/settings-card'
import SimpleButton from '@/src/components/primitives/simple-button'
import ThemeButton from '@/src/components/primitives/theme-button'
import { useTheme } from '@/src/hooks/useTheme'
import { clearSessionFromStore, logout } from '@/src/redux/slices/authSlice'
import { setTheme } from '@/src/redux/slices/themeSlice'
import { RootState } from '@/src/redux/store/myStore'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import { router } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const settings = () => {

  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const currentMode = useSelector((state: RootState) => state.themeReducer.currentMode);
  const user = useSelector((state: RootState) => state.userReducer.user);
  const currentOrg = useSelector((state: RootState) => state.userReducer.user?.currentOrganization ?? null)

  const handleLogout = async () => {
    Alert.alert(t('common.warning'), t('auth.areYouSure'), [
      { text: t('common.cancel') },
      {
        text: t('common.yes'), onPress: async () => {
          dispatch(logout());
          await clearSessionFromStore();
          router.replace('/screens/login-screen');
        }
      }
    ])
  };

  const underDev = () => {
    Alert.alert(`${t('common.warning')}`, `${t('common.underDevelopment')}`, [
      { text: `${t('common.ok')}` }
    ])
  }
  return (
    <ScrollScreen>

      <AuthHeader title={t('settings.title')} />

      <View style={{ paddingHorizontal: mVs(20) }}>

        <View style={[styles.card, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
          <UserAvatar name={user?.fullName || 'Dummy User'} />
          <View style={styles.rightBox}>
            <Text style={[styles.userName, { color: theme.text.primary }]}>{user?.fullName || 'Dummy User'}</Text>
            <Text style={[styles.taxId, { color: theme.text.secondary }]}>{currentOrg?.legalName || `${t('clients.noOrganization')}`}</Text>
          </View>
        </View>

        <Text style={[styles.labelText, { color: theme.text.secondary }]}>{t('settings.theme')}</Text>
        <ThemeButton modeName={t('settings.lightMode')} isActive={currentMode === 'light' ? true : false} onPress={() => dispatch(setTheme('light'))} />
        <ThemeButton modeName={t('settings.darkMode')} isActive={currentMode === 'dark' ? true : false} onPress={() => dispatch(setTheme('dark'))} />
        <ThemeButton modeName={t('settings.system')} isActive={currentMode === 'system' ? true : false} onPress={() => dispatch(setTheme('system'))} />

        <View style={{ marginTop: 20 }} />
        <Text style={[styles.labelText, { color: theme.text.secondary }]}>{t('settings.preferences')}</Text>
        <View style={[styles.preferenceBox, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary, }]}>
          <SettingsCard icon='card-outline' label={t('settings.paymentMethods')} onPress={() => { underDev() }} borderBottom />
          <SettingsCard icon='business-outline' label={t('settings.organizationSettings')} onPress={() => { router.push('/screens/organization-settings') }} borderBottom />
          <SettingsCard icon='cash-outline' label={t('settings.taxSettings')} onPress={() => { underDev() }} borderBottom />
          <SettingsCard icon='language' label={t('settings.languageSettings')} onPress={() => { router.push('/screens/language-settings') }} borderBottom />
          <SettingsCard icon='document-text-outline' label={t('settings.invoiceDefaults')} onPress={() => router.push('/screens/invoice-defaults')} />
        </View>

        <View style={{ marginTop: 20 }} />
        <SimpleButton btnText={t('auth.logout')} onPress={handleLogout} backgroundColor={theme.surface.tertiary} />
      </View>
    </ScrollScreen>
  )
}

export default settings

const styles = StyleSheet.create({
  card: {
    padding: mVs(20),
    borderRadius: mVs(20),
    borderWidth: 1,
    flexDirection: 'row',
    gap: mVs(20),
    marginVertical: mVs(20)
  },
  userName: {
    fontSize: mVs(22),
    fontWeight: 'bold',
  },
  taxId: {
    fontSize: mVs(14),
    fontWeight: 400
  },
  rightBox: {
    gap: mVs(10)
  },
  labelText: {
    fontSize: mVs(16),
    fontWeight: 500,
    marginTop: mVs(30)
  },
  preferenceBox: {
    height: 'auto',
    paddingTop: mVs(20),
    borderRadius: mVs(20),
    borderWidth: 1,
    gap: mVs(20),
    marginVertical: mVs(20),
  }
})