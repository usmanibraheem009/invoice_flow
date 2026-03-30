import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const InputTab = ({icon, placeholder, value, onChangeText, ...props} : any) => {
    const {theme} = useTheme();

    const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, {backgroundColor: theme.background.secondary, borderColor: isFocused? theme.border.tertiary: theme.border.primary}]}>
        {icon}
        <TextInput 
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#B0B5BC'}
        style={styles.textInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
        />
    </View>
  )
}

export default InputTab

const styles = StyleSheet.create({
    container :{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: mVs(12),
        height: mVs(48),
    },
    textInput: {
        flex: 1,
        marginLeft: 8
    }
})