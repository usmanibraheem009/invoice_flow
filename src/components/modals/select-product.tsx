import { useTheme } from '@/src/hooks/useTheme'
import { AppDispatch, RootState } from '@/src/redux/store/myStore'
import { fetchAllProducts } from '@/src/redux/thunks/products-thunk'
import { mVs } from '@/src/utils/scale'
import { Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ModalWrapper from '../layout/modal-wrapper'
import InputTab from '../primitives/input-tab'
import SimpleButton from '../primitives/simple-button'

export interface LineItemForm {
  id: string,
  name: string,
  productId: string
  description: string
  unitPrice: number
  quantity: number
  taxRate: number
}

interface ProductModal {
  visible: boolean
  onClose: () => void
  onSubmit: (item: LineItemForm) => void
  selectedItem?: LineItemForm | null
}

const initialValues: LineItemForm = {
  id: "",
  name: "",
  productId: "",
  description: "",
  unitPrice: 0,
  quantity: 0,
  taxRate: 0
}

const SelectProduct = ({ visible, onClose, onSubmit, selectedItem }: ProductModal) => {


  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.productsReducer.products ?? []);
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, []);

  const filteredProducts = useMemo(() => {
    console.log('products value:', products, typeof products);
    return products?.filter((prod: any) => prod.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, search]);

  return (
    <ModalWrapper modalTitle="Products & Services" visible={visible} onClose={onClose} labelKey={'name'} valueKey={'id'}>
      <Formik initialValues={selectedItem ?? initialValues} enableReinitialize
        onSubmit={(values) => {
          console.log('values: ', values)
          const payload = {
            ...values,
            productId: values.productId
          };
          onSubmit(payload)
          onClose()
        }}>
        {({ values, setFieldValue, handleSubmit }) => {

          const total = Number(values.quantity) * Number(values.unitPrice);
          return (
            <View style={{ gap: mVs(15) }}>

              <Pressable onPress={() => setShowDropdown(!showDropdown)}>
                <InputTab editable={false} placeholder="Select product/service" value={values.name} />
              </Pressable>

              {showDropdown && (
                <FlatList
                  data={filteredProducts}
                  keyExtractor={(item) => item.id}
                  style={[styles.dropdown, { borderColor: theme.border.secondary }]}
                  renderItem={({ item }) => (
                    <Pressable style={[styles.dropdownItem, { borderColor: theme.border.secondary }]}
                      onPress={() => {
                        setFieldValue('productId', item.id)
                        setFieldValue('name', item.name)
                        setFieldValue('description', item.description)
                        setFieldValue('unitPrice', item.unitPrice)
                        setShowDropdown(false);
                      }}>
                      <Text style={[styles.product, { color: theme.text.primary }]}>{item.name}</Text>
                      <Text style={[styles.product, { color: theme.text.primary }]}>$ {item.unitPrice}</Text>
                    </Pressable>
                  )}
                />)}

              <InputTab placeholder="Quantity..." value={values.quantity.toString()} keyboardType="numeric"
                onChangeText={(text) => {
                  const qty = Number(text);
                  if (qty <= 0) return;
                  setFieldValue('quantity', qty)
                }
                } />

              <InputTab editable={false} placeholder="Total" value={total.toFixed(2)} onChangeText={(text) => setFieldValue('total', total)} />

              <SimpleButton btnText={selectedItem ? 'Update Product' : 'Add Product'} onPress={handleSubmit} />
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
    borderRadius: 6,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
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