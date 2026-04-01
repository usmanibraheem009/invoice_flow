import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import SimpleButton from '@/src/components/primitives/simple-button'
import { setTheme } from '@/src/redux/slices/themeSlice'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'

const settings = () => {

  const dispatch = useDispatch();

  return (
    <ScreenWrapper>
      <SimpleButton btnText='Light Mode' onPress={() => dispatch(setTheme('light'))} />
        <View style={{marginTop: 20}}/>
      <SimpleButton btnText='Dark Mode' onPress={() => dispatch(setTheme('dark'))} />
    </ScreenWrapper>
  )
}

export default settings

const styles = StyleSheet.create({})