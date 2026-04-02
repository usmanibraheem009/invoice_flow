import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ArrowBack from './arrow-back';

interface AuthHeaderProps{
  title?: string,
  arrowBack? : boolean,
  subtitle?: string,
  trailingIcon?: keyof typeof Ionicons.glyphMap;
}

const AuthHeader = ({ title, arrowBack, trailingIcon }: AuthHeaderProps) => {

  const {theme} = useTheme();

  return (
    <View style={[styles.container, {borderBottomColor: theme.border.secondary}]}>
      <View style={styles.leftIcon}>
      {arrowBack && (
        <ArrowBack />
      )}
      
    </View>

    <View style={styles.title}>
      {title && (
        <Text style={[styles.titleText,{color: theme.text.primary}]}>{title}</Text>
      )}
    </View>

    <View style={styles.rightIcon}>
      {trailingIcon && (
        <Ionicons name={trailingIcon} size={24} color={theme.text.primary} />
      )}
    </View>
    </View>
  )
}

export default AuthHeader

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    height: mVs(96),
    marginBottom: mVs(10),
    // marginTop: mVs(10),
    borderBottomWidth: 1,
    paddingTop: mVs(30),
    paddingHorizontal: mVs(20)
  },
  title: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftIcon: {
    flex: 1,
    alignItems: 'flex-start'
  },
  rightIcon: {
    flex: 1,
    alignItems: 'flex-end'
  },
  titleText: {
    fontSize: mVs(20),
    fontWeight: 500,
  }
})