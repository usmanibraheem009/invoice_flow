import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { initialValues, validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import ErrorText from '../../components/error-text'

const SignupScreen = () => {

  const { theme } = useTheme();
  const dispatch = useDispatch();

  const submitFunc = async () => {
    router.push('/(tabs)')
  };

  return (
    <ScreenWrapper scrollable keyboardAvoidingView paddingHorizontal={20}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/images/icon.png')} style={styles.logo} />
        <Formik initialValues={initialValues.signup} validationSchema={validationSchema.signup} onSubmit={submitFunc}>
          {({ errors, touched, handleChange, handleSubmit, values }: any) => (
            <View>
              <Text style={[styles.label, { color: theme.text.secondary }]}>USER NAME</Text>
              <InputTab placeholder='user name' value={values.userName} onChangeText={handleChange('userName')} icon={<Ionicons name='person' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.userName && errors.userName && (<ErrorText errorText={errors.userName} />)}
              <Text style={[styles.label, { color: theme.text.secondary }]}>EMAIL</Text>
              <InputTab placeholder='email' value={values.email} onChangeText={handleChange('email')} icon={<Ionicons name='mail' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.email && errors.email && (<ErrorText errorText={errors.email} />)}
              <Text style={[styles.label, { color: theme.text.secondary }]}>PASSWORD</Text>
              <InputTab placeholder='password' value={values.password} onChangeText={handleChange('password')} icon={<Ionicons name='lock-closed' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.password && errors.password && (<ErrorText errorText={errors.password} />)}
              <Text style={[styles.label, { color: theme.text.secondary }]}>CONFIRM PASSWORD</Text>
              <InputTab placeholder='confirm password' value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} icon={<Ionicons name='lock-closed' size={mVs(22)} color={theme.text.secondary} />} />
              {touched.confirmPassword && errors.confirmPassword && (<ErrorText errorText={errors.confirmPassword} />)}

              <TouchableOpacity onPress={() => { router.push('/screens/login-screen') }} style={styles.router}>
                <Text style={[styles.authText, { color: theme.text.secondary }]}>Already have an account?</Text>
                <Ionicons name='arrow-forward' size={20} color={theme.text.secondary} />
              </TouchableOpacity>

              <View style={{ marginTop: 20 }} />
              <SimpleButton btnText='SIGN UP' onPress={() => router.push('/(tabs)')} />

            </View>
          )}

        </Formik>
      </View>
    </ScreenWrapper>
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