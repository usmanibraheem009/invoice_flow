import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import InputTab from './input-tab'
import ItemModeToggle, { ItemMode } from './item-mode-toggle'
import SimpleButton from './simple-button'

interface modalProps{
    visible: boolean,
    onClose: () => void,
};

const ItemModal = ({visible, onClose}: modalProps) => {

    const {theme} = useTheme();
    const [mode, setMode] = useState<ItemMode>('Product');

  return (
    <Modal visible={visible} transparent animationType='slide'>
        <View style={styles.overlay}>
            <View style={[styles.modal,{backgroundColor: theme.background.secondary, borderColor: theme.border.secondary}]}>
                
                <Ionicons name='close' color={theme.text.primary} size={24} onPress={onClose} style={styles.close} />
                <ItemModeToggle mode={mode} onModeChange={setMode}/>

                {mode === 'Product' ? (
                    <View>
                        <InputTab />
                    </View>
                ) : (
                    <View>
                        <SimpleButton btnText='SUBMIT' onPress={() => {}} />
                    </View>
                )}
            </View>
        </View>
    </Modal>
  )
}

export default ItemModal

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
        borderWidth: 1
    },
    close: {
        alignSelf: 'flex-end',
        marginBottom: mVs(10)
    }
})