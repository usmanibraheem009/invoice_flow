import useTheme from '@/src/hooks/useTheme'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface dropDownItem{
    label: string,
    value: string,
}

interface dropDownProps {
    values: dropDownItem[],
    dropDownItems?: string,
    onSelectedItem: (item: any) => void
}

const DropDown = ({ values, dropDownItems, onSelectedItem }: dropDownProps) => {

    const { theme } = useTheme();

    return (
        <View style={styles.countryList}>
            {values.map((item) => (
                <Pressable key={item.value} style={styles.dropdownItem} onPress={() => onSelectedItem(item)}>
                    <Text style={[{ color: theme.text.primary }]}>{item.label}</Text>
                </Pressable>
            ))}
        </View>
    )
}

export default DropDown

const styles = StyleSheet.create({
    countryList: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
})