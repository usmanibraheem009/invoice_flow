import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import ReportCard from '@/src/components/primitives/report-card'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { setTheme } from '@/src/redux/slices/themeSlice'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import InvoiceCard from '../../components/primitives/invoice-card'
import AuthHeader from '../components/auth-header'

const LoginScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  return (
    <ScreenWrapper>
      <AuthHeader title='Dashboard' />
      <ReportCard />
        <View style={{marginTop: 20}} />
      <InvoiceCard />
        <View style={{marginTop: 20}} />
      <InputTab />
        <View style={{marginTop: 20}} />
      <SimpleButton btnText='lightMode' onPress={() => dispatch(setTheme('light'))} />
        <View style={{marginTop: 20}} />
      <SimpleButton btnText='darkMode' onPress={() =>dispatch ( setTheme('dark'))} />
    </ScreenWrapper>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})