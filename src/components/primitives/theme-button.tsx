import { useTheme } from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface themeButtonProps{
    modeName: string,
    isActive: boolean,
    onPress: () => void,
}

const ThemeButton = ({isActive, onPress, modeName}: themeButtonProps) => {

    const { theme } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
            <Text style={[styles.labelText, { color: theme.text.secondary }]}>{modeName}</Text>
            <Ionicons name={isActive? 'radio-button-on' : 'radio-button-off'} size={mVs(24)} color={theme.text.primary} selectionColor={theme.text.primary} onPress={onPress}/>
        </View>
    )
}

export default ThemeButton

const styles = StyleSheet.create({
    card: {
        padding: mVs(15),
        borderRadius: mVs(10),
        borderWidth: 1,
        flexDirection: 'row',
        gap: mVs(20),
        marginTop: mVs(10),
        justifyContent: 'space-between'
    },
    labelText: {
        fontSize: mVs(16),
        fontWeight: 500
    }
})