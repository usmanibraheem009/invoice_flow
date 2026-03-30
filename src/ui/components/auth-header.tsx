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

const AuthHeader = ({ title, arrowBack, subtitle, trailingIcon }: AuthHeaderProps) => {

  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <View>
      {arrowBack && (
        <ArrowBack />
      )}
      
    </View>

    <View>
      {title && (
        <Text style={[styles.title,{color: theme.text.primary}]}>{title}</Text>
      )}
    </View>

    <View>
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
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 10
  },
  title: {
    fontSize: mVs(20),
    fontWeight: 500,
  }
})