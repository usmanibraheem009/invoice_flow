import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { setTheme } from '@/src/redux/slices/themeSlice'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {

  const mode = useSelector((state:any) => state.themeReducer.currentMode);
  console.log(mode);
    const dispatch = useDispatch();
    const {theme} = useTheme();

  return (
    <ScreenWrapper backgroundColor= {theme.background.primary}> 
      <SimpleButton btnText="light Mode" onPress={() => {dispatch(setTheme('light'))}} />
      <SimpleButton btnText="dark Mode" onPress={() => {dispatch(setTheme('dark'))}} />
    </ScreenWrapper>
  ) 
}

export default index

const styles = StyleSheet.create({})