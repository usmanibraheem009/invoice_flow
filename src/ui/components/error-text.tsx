import React from 'react'
import { StyleSheet, Text } from 'react-native'

interface ErrorTextProps{
    errorText: string
};

const ErrorText = ({errorText}: ErrorTextProps) => {
  return (
    <Text style={styles.text}>{errorText}</Text>
  )
}

export default ErrorText

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        color: 'red',
        fontWeight: 500,
    }
})