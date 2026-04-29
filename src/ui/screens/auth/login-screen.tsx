import { fetchCurrentUser, loginUser } from '@/src/apis/authApi'
import { LoginRequest } from '@/src/apis/types/type'
import { KeyboardScreen } from '@/src/components/layout'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { saveSessionToStore, setSession } from '@/src/redux/slices/authSlice'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { AppDispatch } from '@/src/redux/store/myStore'
import { initialValues, validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import ErrorText from '../../components/error-text'

const LoginScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const submitFunc = async (values: LoginRequest) => {
    dispatch(setLoading(true))
    try {
      const res = await loginUser({ email: values.email, password: values.password });
      dispatch(showSnackbar({ message: `${t('auth.welcomeBack')}`, type: 'success' }));

      dispatch(setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: res.expiresAt,
        sessionId: res.sessionId,
        isLoggedIn: true
      }));

      await saveSessionToStore({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: res.expiresAt,
        sessionId: res.sessionId,
        isLoggedIn: true
      });

      await dispatch(fetchCurrentUser());
      if (res?.accessToken) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      dispatch(showSnackbar({ message: error.message, type: 'error' }))
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardScreen paddingHorizontal={20}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/images/icon.png')} style={styles.logo} />
        <Formik initialValues={initialValues.login} validationSchema={validationSchema.login} onSubmit={submitFunc}>
          {({ errors, touched, handleChange, values, handleSubmit }: any) => (
            <View>

              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.email')}</Text>
              <InputTab placeholder={t('auth.email')} value={values.email} onChangeText={handleChange('email')} icon={<Ionicons name='mail' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.email && errors.email && (<ErrorText errorText={errors.email} />)}

              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.password')}</Text>
              <InputTab placeholder={t('auth.password')} value={values.password} onChangeText={handleChange('password')} icon={<Ionicons name='lock-closed' size={mVs(22)} color={theme.text.secondary} />} secureTextEntry={true} />
              {touched.password && errors.password && (<ErrorText errorText={errors.password} />)}

              <TouchableOpacity onPress={() => { router.push('/screens/signup-screen') }} style={styles.router}>
                <Text style={[styles.authText, { color: theme.text.secondary }]}>{t('auth.dontHaveAccount')}</Text>
                <Ionicons name='arrow-forward' size={20} color={theme.text.secondary} />
              </TouchableOpacity>

              <View style={{ marginTop: 20 }} />
              <SimpleButton btnText={t('auth.login')} onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardScreen>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: mVs(40)
  },
  router: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: mVs(10),
  },
  authText: {
    fontSize: mVs(14),
    fontWeight: 500,
  },
  logo: {
    height: 200,
    width: 200,
    alignSelf: 'center'
  },
  label: {
    fontSize: mVs(14),
    fontWeight: 500,
    marginTop: mVs(10),
    marginBottom: mVs(3),
  },
})