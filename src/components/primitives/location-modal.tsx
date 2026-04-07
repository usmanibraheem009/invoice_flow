import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import InputTab from './input-tab'

interface modalItem {
    label: string,
    value: string,
}

interface modalProps {
    values: modalItem[],
    modalTitle?: string,
    onSelected: (item: modalItem) => void,
    visible: boolean,
    onClose: () => void
}

const LocationModal = ({ values, modalTitle, onSelected, onClose, visible }: modalProps) => {

    const { theme } = useTheme();
    const [searchLocation, setSearchLocation] = useState('');
    const [filteredValues, setFilteredValues] = useState(values);

    useEffect(() => {
        setFilteredValues(
            values.filter((item) => item.label.toLocaleLowerCase().includes(searchLocation.toLocaleLowerCase()))
        )
    }, [searchLocation, values]);

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>

                        <View style={[styles.header, { borderBottomColor: theme.border.primary }]}>
                            <Text style={{ color: theme.text.primary, fontSize: 16, fontWeight: '600' }}>{modalTitle}</Text>
                            <Ionicons name='close' color={theme.text.primary} size={24} onPress={onClose} />
                        </View>

                        <InputTab placeholder='Search' value={searchLocation} onChangeText={ setSearchLocation}
                            icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />} />

                        <FlatList data={filteredValues} keyExtractor={(item) => item.label} renderItem={({ item }) => (
                            <Pressable style={[styles.dropdownItem, { borderColor: theme.border.primary }]} onPress={() => { onSelected(item); onClose(); setSearchLocation('') }}>
                                <Text style={{ color: theme.text.primary }}>{item.label}</Text>
                            </Pressable>
                        )}>

                        </FlatList>

                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default LocationModal

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },

    modal: {
        borderTopLeftRadius: mVs(30),
        borderTopRightRadius: mVs(30),
        padding: mVs(20),
        borderWidth: 1,
        maxHeight: '70%' // prevents overflow
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: mVs(10),
        borderBottomWidth: 1,
        paddingBottom: mVs(20)
    },

    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        marginVertical: 10
    },

})