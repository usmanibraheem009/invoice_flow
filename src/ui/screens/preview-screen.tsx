import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import React from 'react'
import { StyleSheet } from 'react-native'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const PreviewScreen = () => {

  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <AuthHeader arrowBack title='Step 3 of 3' />

      <ScreenFooter backButton>
        <SimpleButton btnText='Send Now' onPress={() => { }} />
      </ScreenFooter>
    </ScreenWrapper>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({

})