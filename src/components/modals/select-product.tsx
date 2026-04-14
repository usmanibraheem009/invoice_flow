import { useTheme } from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import ModalWrapper from '../layout/modal-wrapper'
import InputTab from '../primitives/input-tab'
import SimpleButton from '../primitives/simple-button'

interface InvoiceItem {
  id: string
  quantity: number
  name: string
  price: number
  total: number
  type: 'Product' | 'Service'
  onDelete?: () => void
  onEdit?: () => void,
}

interface ProductModal {
  visible: boolean
  onClose: () => void
  onSubmit: (item: InvoiceItem) => void
  onSelectedItem?: InvoiceItem | null
}

const initialValues: InvoiceItem = {
  id: '',
  quantity: 0 ,
  name: '',
  price: 0,
  total: 0,
  type: 'Product',
}

const SelectProduct = ({ visible, onClose, onSubmit, onSelectedItem }: ProductModal) => {

  const products = useSelector((state: any) => state.productsReducer.products) 
  const [showDropdown, setShowDropdown] = useState(false)
  const {theme} = useTheme();

  return (
    <ModalWrapper modalTitle="Products & Services" visible={visible} onClose={onClose} labelKey={'name'} valueKey={'id'}>
      <Formik
        initialValues={ onSelectedItem ?? initialValues}
        enableReinitialize
        onSubmit={(values) => {
          onSubmit(values)
          onClose()}}>
        {({ values, handleChange, setFieldValue, handleSubmit }) => {

          useEffect(() => {
            setFieldValue('total', values.price * Number(values.quantity))
          }, [values.quantity, values.price])

          return (
            <View style={{ gap: 12 }}>

              <Pressable onPress={() => setShowDropdown(!showDropdown)}>
                <InputTab editable={false} placeholder="Select product/service" value={values.name} />
              </Pressable>

              {showDropdown && (
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdown}
                  renderItem={({ item }) => (
                    <Pressable style={styles.dropdownItem}
                      onPress={() => {
                        setFieldValue('id', item.id)
                        setFieldValue('name', item.name)
                        setFieldValue('price', item.price)
                        setShowDropdown(false)
                      }}>
                      <Text style={[styles.product, {color: theme.text.primary}]}>{item.name}</Text>
                      <Text style={[styles.product, {color: theme.text.primary}]}>${item.price}</Text>
                    </Pressable>
                  )}
                />
              )}

              <InputTab placeholder="Quantity..." value={values.quantity.toString()} onChangeText={(text) => setFieldValue('quantity', Number(text))} keyboardType="numeric" />

              <InputTab editable={false} placeholder="Total" value={values.total.toString()} />

              <SimpleButton btnText='Add Product' onPress={handleSubmit} />
            </View>
          )
        }}
      </Formik>
    </ModalWrapper>
  )
}

export default SelectProduct

const styles = StyleSheet.create({
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  product: {
    fontSize: mVs(16),
    fontWeight: 400,
  }
})