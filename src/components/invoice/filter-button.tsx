import useTheme from '@/src/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FilterButtonProps{
    label: string,
    value: string,
    activeValue: string,
    onPress: (value :string) => void,
}

const FilterButton = ({onPress, label, activeValue, value} : FilterButtonProps) => {

    const isActive = value === activeValue;
    const {theme} = useTheme();
    
    return (
        <TouchableOpacity
            onPress={() => onPress(value)}
            style={[styles.filterButton, {borderColor: theme.border.primary, backgroundColor: theme.background.secondary}, isActive && [styles.activeFilterButton, {backgroundColor: theme.surface.secondary}]]} >
            <Text style={[styles.filterText, {color: theme.text.secondary}, isActive && styles.activeFilterText, ]} >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default FilterButton

const styles = StyleSheet.create({
    filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1
  },
    activeFilterButton: {
  },

  filterText: {
    
  },

  activeFilterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffff',
  },
})