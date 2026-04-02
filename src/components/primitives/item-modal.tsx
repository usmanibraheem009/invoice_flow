import useTheme from '@/src/hooks/useTheme'
import ErrorText from '@/src/ui/components/error-text'
import { validationSchema } from '@/src/utils/auth-form'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { Formik } from 'formik'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native'
import { InvoiceItem } from '../invoice/product-card'
import InputTab from './input-tab'
import ItemModeToggle, { ItemMode } from './item-mode-toggle'
import SimpleButton from './simple-button'

interface modalProps {
    visible: boolean,
    onClose: () => void,
    onSubmitItem: (item: any) => void,
    editItem?: InvoiceItem | null,
}


const ItemModal = ({ visible, onClose, onSubmitItem, editItem }: modalProps) => {

    const { theme } = useTheme();
    const [mode, setMode] = useState<ItemMode>('Product');

    const onSubmitFunc = (values: any, { resetForm }: any) => {
        const total = (Number(values.price) || 0) * (Number(values.quantity) || 0);

        const item = {
            id: editItem?.id || Date.now().toString(),
            name: values.name,
            price: Number(values.price),
            quantity: Number(values.quantity),
            type: mode,
            total
        };

        onSubmitItem(item);
        resetForm();
        onClose();
    };


    return (
        <Modal visible={visible} transparent animationType='slide'>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.overlay}>
                    <View style={[styles.modal, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
                        <Ionicons name='close' color={theme.text.primary} size={24} onPress={onClose} style={styles.close} />
                        <Formik enableReinitialize initialValues={{
                            name: editItem?.name ? editItem?.name : '',
                            price: editItem?.price? String(editItem?.price) : '',
                            quantity: editItem?.quantity? String(editItem?.quantity) : '',
                        }} validationSchema={validationSchema.prdocutModal} onSubmit={onSubmitFunc}>

                            {({ values, handleChange, handleSubmit, errors, touched }) => {
                                const total = (Number(values.price) || 0) * (Number(values.quantity) || 0);
                                return (
                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 12 }} >
                                        <ItemModeToggle mode={mode} onModeChange={setMode} />
                                        <InputTab placeholder={mode === 'Product' ? 'Product Name' : 'Service Name'}
                                            value={values.name} onChangeText={handleChange('name')} />
                                        {touched.name && errors.name && (<ErrorText errorText={errors.name} />)}

                                        <InputTab placeholder={mode === 'Product' ? 'Price' : 'Price Per Hour'} keyboardType='numeric'
                                            value={values.price} onChangeText={handleChange('price')} />
                                        {touched.price && errors.price && (<ErrorText errorText={errors.price} />)}

                                        <InputTab placeholder={mode === 'Product' ? 'Quantity' : 'Hours'} keyboardType='numeric'
                                            value={values.quantity} onChangeText={handleChange('quantity')} />
                                        {touched.quantity && errors.quantity && (<ErrorText errorText={errors.quantity} />)}

                                        <InputTab placeholder='Total' value={String(total)} editable={false} />

                                        <SimpleButton btnText={editItem? 'EDIT ITEM' : 'ADD ITEM'} onPress={handleSubmit} />

                                    </ScrollView>

                                )
                            }}
                        </Formik>
                    </View>
                </View>
            </KeyboardAvoidingView>
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