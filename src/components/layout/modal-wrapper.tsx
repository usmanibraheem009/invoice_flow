import useTheme from '@/src/hooks/useTheme';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import InputTab from '../primitives/input-tab';


interface modalProps {
    searchBar?: boolean,
    modalTitle?: string,
    visible: boolean,
    data?: any[],
    labelKey: string,
    valueKey: string,
    onItemPress?: (item: any) => void,
    onClose: () => void,
    children?: React.ReactNode,
}

const ModalWrapper = ({ visible, searchBar, data, children, modalTitle, onClose, onItemPress, labelKey, valueKey }: modalProps) => {

    const { theme } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>(data || []);

    useEffect(() => {
        if (data && labelKey) {
            const filtered = data.filter((item) => item[labelKey]?.toLowerCase().includes(searchText.toLowerCase()))
            setFilteredData(filtered);
        }
    }, [searchText, data, labelKey]);

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>

                        <View style={[styles.header, { borderBottomColor: theme.border.primary }]}>
                            <Text style={{ color: theme.text.primary, fontSize: 16, fontWeight: '600' }}>{modalTitle}</Text>
                            <Ionicons name='close' color={theme.text.primary} size={24} onPress={onClose} />
                        </View>

                        {searchBar && (
                            <InputTab placeholder='Search' value={searchText} onChangeText={setSearchText} icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />} />
                        )}

                        {
                            data ? (
                                <FlatList data={filteredData} keyExtractor={(item, index) => item[valueKey] || index.toString()} renderItem={({ item }) => (
                                    <Pressable style={[styles.dropdownItem, { borderColor: theme.border.primary }]} onPress={() => { onItemPress?.(item); onClose(); setSearchText('') }}>
                                        <Text style={{ color: theme.text.primary }}>{item[labelKey] || ''}</Text>
                                    </Pressable>
                                )} />
                            ) : (
                                children
                            )
                        }


                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default ModalWrapper

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
        maxHeight: '70%' // 
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