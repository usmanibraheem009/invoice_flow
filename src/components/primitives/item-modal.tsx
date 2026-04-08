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
    Switch,
    Text,
    View
} from 'react-native'
import { useDispatch } from 'react-redux'
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
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();

    const onSubmitFunc = (values: any, { resetForm }: any) => {

        const item = {
            id: editItem?.id || Date.now().toString(),
            name: values.name,
            description: values.description,
            price: parseFloat(values.unitPrice) || 0,
            type: mode,
            isActive: isActive
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
                        <Formik enableReinitialize validationSchema={validationSchema.productModal} onSubmit={onSubmitFunc}
                        initialValues={{
                            name: editItem?.name ? editItem?.name : '',
                            description: editItem?.description ? String(editItem?.description) : '',
                            unitPrice: editItem?.price ? String(editItem?.price) : '',
                        }} >

                            {({ values, handleChange, handleSubmit, errors, touched }) => {
                                return (
                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 12 }} >
                                        <ItemModeToggle mode={mode} onModeChange={setMode} />

                                        <InputTab placeholder={mode === 'Product' ? 'Product Name' : 'Service Name'}
                                            value={values.name} onChangeText={handleChange('name')} />
                                        {touched.name && errors.name && (<ErrorText errorText={errors.name} />)}

                                        <InputTab placeholder={'Description'}
                                            value={values.description} onChangeText={handleChange('description')} />
                                        {touched.description && errors.description && (<ErrorText errorText={errors.description} />)}

                                        <InputTab placeholder={mode === 'Product' ? 'Unit Price' : 'Price Per Hour'} keyboardType='numeric'
                                            value={values.unitPrice} onChangeText={handleChange('unitPrice')} />
                                        {touched.unitPrice && errors.unitPrice && (<ErrorText errorText={errors.unitPrice} />)}

                                        <View style={styles.rememberContainer}>
                                            <Text style={[styles.rememberText, {color: theme.text.secondary}]}>Active Product</Text>
                                            <Switch value={isActive} onValueChange={(value) => setIsActive(value)} />
                                        </View>

                                        <SimpleButton btnText={editItem ? 'EDIT ITEM' : 'ADD ITEM'} onPress={() => handleSubmit()} />

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
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: mVs(16),
        justifyContent: 'space-between',
    },
    rememberText: {
        fontSize: 16,
    },

})