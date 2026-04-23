import { fetchCurrentUser, signupUser } from '@/src/apis/authApi'
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
import { ActivityIndicator } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import ErrorText from '../../components/error-text'

const SignupScreen = () => {

  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: any) => state.loadingReducer.loading);

  const submitFunc = async (values: any) => {
    if (!values.fullName || !values.email || !values.password) {
      return dispatch(showSnackbar({ message: 'All fields are required', type: 'error' }));
    }

    dispatch(setLoading(true));
    try {
      const res = await signupUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });
      console.log('payload being sent: ', values);
      dispatch(showSnackbar({ message: res.message, type: 'success' }));
      dispatch(setSession({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expiresAt: res.data.expiresAt,
        sessionId: res.data.sessionId,
        isLoggedIn: true
      }));

      await saveSessionToStore({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        expiresAt: res.data.expiresAt,
        sessionId: res.data.sessionId,
        isLoggedIn: true
      });

      await new Promise(r => setTimeout(r, 100));

      await dispatch(fetchCurrentUser());
      if (res?.data.accessToken) {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.log('error function triggered', err)
      dispatch(showSnackbar({ message: err.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };


  return (
    <KeyboardScreen paddingHorizontal={20}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/images/icon.png')} style={styles.logo} />
        <Formik initialValues={initialValues.signup} validationSchema={validationSchema.signup} onSubmit={submitFunc}>
          {({ errors, touched, handleChange, handleSubmit, values }: any) => (
            <View>
              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.userName')}</Text>
              <InputTab placeholder={t('auth.userName')} value={values.fullName} onChangeText={handleChange('fullName')} icon={<Ionicons name='person' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.fullName && errors.fullName && (<ErrorText errorText={errors.fullName} />)}

              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.email')}</Text>
              <InputTab placeholder={t('auth.email')} value={values.email} onChangeText={handleChange('email')} icon={<Ionicons name='mail' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.email && errors.email && (<ErrorText errorText={errors.email} />)}

              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.password')}</Text>
              <InputTab placeholder={t('auth.password')} value={values.password} onChangeText={handleChange('password')} icon={<Ionicons name='lock-closed' size={mVs(22)} color={theme.text.secondary} secureTextEntry />} />
              {touched.password && errors.password && (<ErrorText errorText={errors.password} />)}

              <Text style={[styles.label, { color: theme.text.secondary }]}>{t('auth.confirmPassword')}</Text>
              <InputTab placeholder={t('auth.confirmPassword')} value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} icon={<Ionicons name='lock-closed' size={mVs(22)} color={theme.text.secondary} secureTextEntry />} />
              {touched.confirmPassword && errors.confirmPassword && (<ErrorText errorText={errors.confirmPassword} />)}

              <TouchableOpacity onPress={() => { router.push('/screens/login-screen') }} style={styles.router}>
                <Text style={[styles.authText, { color: theme.text.secondary }]}>{t('auth.alreadyHaveAccount')}</Text>
                <Ionicons name='arrow-forward' size={20} color={theme.text.secondary} />
              </TouchableOpacity>

              <View style={{ marginTop: 20 }} />
              <SimpleButton btnText={loading ? <ActivityIndicator color={theme.text.primary} size={40} /> : `${t('auth.signUp')}`} onPress={handleSubmit} />

            </View>
          )}

        </Formik>
      </View>
    </KeyboardScreen>
  )
}

export default SignupScreen

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