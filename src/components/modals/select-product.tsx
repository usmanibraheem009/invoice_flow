import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import ModalWrapper from '../layout/modal-wrapper'
import InputTab from '../primitives/input-tab'

interface InvoiceItem {
  id: string
  quantity: number
  name: string
  price: number
  total: number
  type: 'Product' | 'Service'
  onDelete?: () => void
  onEdit?: () => void
}

interface ProductModal {
  visible: boolean
  onClose: () => void
  onSubmit: (item: InvoiceItem) => void
}

const initialValues: InvoiceItem = {
  id: '',
  quantity: 1,
  name: '',
  price: 0,
  total: 0,
  type: 'Product',
}

const SelectProduct = ({ visible, onClose, onSubmit }: ProductModal) => {
  const products = useSelector((state: any) => state.productsReducer.products) 
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <ModalWrapper modalTitle="Products & Services" visible={visible} onClose={onClose} labelKey={'name'} valueKey={'id'}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values)
          onClose()
        }}
      >
        {({ values, handleChange, setFieldValue, handleSubmit }) => {
          // Recalculate total when quantity or price changes
          useEffect(() => {
            setFieldValue('total', values.price * values.quantity)
          }, [values.quantity, values.price])

          return (
            <View style={{ gap: 12 }}>
              {/* Product Selection */}
              <Pressable onPress={() => setShowDropdown(!showDropdown)}>
                <InputTab
                  editable={false}
                  placeholder="Select product/service"
                  value={values.name}
                />
              </Pressable>

              {/* Dropdown */}
              {showDropdown && (
                <FlatList
                  data={products}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdown}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFieldValue('id', item.id)
                        setFieldValue('name', item.name)
                        setFieldValue('price', item.price)
                        setShowDropdown(false)
                      }}
                    >
                      <Text>{item.name}</Text>
                      <Text>${item.price}</Text>
                    </Pressable>
                  )}
                />
              )}

              {/* Quantity */}
              <InputTab
                placeholder="Quantity..."
                value={values.quantity.toString()}
                onChangeText={(text) => setFieldValue('quantity', Number(text))}
                keyboardType="numeric"
              />

              {/* Total */}
              <InputTab editable={false} placeholder="Total" value={values.total.toString()} />

              {/* Submit */}
              <Pressable onPress={() => handleSubmit} style={styles.submitBtn}>
                <Text style={{ color: 'white' }}>Add Product</Text>
              </Pressable>
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
})