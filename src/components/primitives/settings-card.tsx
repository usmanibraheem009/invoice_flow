import { useTheme } from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface settingsCardProps {
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    onPress: () => void,
    borderBottom?: boolean,
}

const SettingsCard = ({ onPress, icon, label, borderBottom }: settingsCardProps) => {

    const { theme } = useTheme();

    return (
        <Pressable onPress={ onPress} style={[styles.container, { borderBottomColor: theme.border.secondary, borderBottomWidth: borderBottom ? 1.5 : 0 }]}>
            <View style={{flexDirection: 'row', gap: mVs(20)}}>
                <Ionicons name={icon} size={mVs(24)} color={theme.text.secondary} />
                <Text style={[styles.labelText, { color: theme.text.primary }]}>{label}</Text>
            </View>
            <Ionicons name='chevron-forward' size={mVs(24)} color={theme.text.secondary} />
        </Pressable>
    )
}

export default SettingsCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        paddingBottom: mVs(15),
        paddingHorizontal: mVs(20),
    },
    labelText: {
        fontSize: mVs(18),
        fontWeight: 400
    }
})