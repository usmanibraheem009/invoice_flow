import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type ItemMode = 'Product' | 'Service';

interface itemModeProps {
    mode: ItemMode,
    onModeChange: (mode: ItemMode) => void,
}

const ItemModeToggle = ({ mode, onModeChange }: itemModeProps) => {

    const { theme } = useTheme();

    return (
        
        <View style={[styles.container, {backgroundColor: theme.background.secondary, borderColor: theme.border.secondary}]}>
            <Pressable style={[styles.option, {backgroundColor: mode === 'Product' ? theme.surface.secondary : 'transparent'}]} onPress={()=> onModeChange('Product')}>
                <Text style={[styles.text,{color:  mode === 'Product' ? '#ffff': theme.text.secondary}]}>Product</Text>
            </Pressable>

            <Pressable style={[styles.option, {backgroundColor: mode === 'Service' ? theme.surface.secondary : 'transparent'}]} onPress={()=> onModeChange('Service')}>
                <Text style={[styles.text,{color: mode === 'Service' ? '#ffff': theme.text.secondary}]}>Service</Text>
            </Pressable>
        </View>
    )
}

export default ItemModeToggle

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: mVs(20),
        borderWidth: 1,
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: mVs(10),
    },
    text: {
        fontSize: mVs(14),
        fontWeight: 500,
    }
})