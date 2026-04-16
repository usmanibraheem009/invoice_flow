import { useTheme } from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingIndicator = () => {

    const { theme } = useTheme();
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={theme.text.primary} />
            <Text style={[styles.loadingText, { color: theme.text.primary }]}>Loading invoice...</Text>
        </View>
    )
}

export default LoadingIndicator

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1
    },
    loadingText: {
        fontSize: mVs(14),
        fontWeight: 500
    }
})