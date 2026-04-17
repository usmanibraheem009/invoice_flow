import { createInvoice } from '@/src/apis/invoiceApi'
import InvoiceStatus from '@/src/components/invoice/invoice-status'
import ModalWrapper from '@/src/components/layout/modal-wrapper'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { setInvoiceStatus, setNotes } from '@/src/redux/slices/invoiceSlice'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { RootState } from '@/src/redux/store/myStore'
import { formatCurrency } from '@/src/utils/helper'
import { getClientById, mapInvoiceToApi, selectInvoiceGrandTotal, selectInvoiceStatus, selectInvoiceSubtotal, selectInvoiceTaxTotal } from '@/src/utils/invoiceSelectors'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const status = [
  { name: 'PAID', value: 'PAID' },
  { name: 'OVERDUE', value: 'OVERDUE' },
  { name: 'DRAFT', value: 'DRAFT' },
]

const PreviewScreen = () => {

  const { theme } = useTheme();
  const notes = useSelector((state: RootState) => state.invoiceReducer.draft.notes);
  const draft = useSelector((state: RootState) => state.invoiceReducer.draft);
  const finalData = React.useMemo(() => mapInvoiceToApi(draft), [draft]);
  console.log("final data: ", finalData);

  const clientName = useSelector(getClientById);
  const subTotal = useSelector(selectInvoiceSubtotal);
  const taxRate = useSelector(selectInvoiceTaxTotal);
  const grandTotal = useSelector(selectInvoiceGrandTotal);
  const invoStatus = useSelector(selectInvoiceStatus)
  const discount = subTotal > 1500 ? subTotal * 5 / 100 : 0;
  const [statusModal, setStatusModal] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    dispatch(setLoading(true));
    try {
      const response = await createInvoice(values);
      const createdInvoice = response.data;
      console.log('created invoice: ', createdInvoice);
      dispatch(showSnackbar({ message: response.message, type: 'success' }));
      router.replace('/(tabs)/invoices');
      await AsyncStorage.setItem('lastInvoiceNumber', values.invoiceNumber)
    } catch (error: any) {
      dispatch(showSnackbar({ message: error.message, type: 'error' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <ScreenWrapper scrollable paddingVertical={10} keyboardAvoidingView>
        <AuthHeader arrowBack title='Step 3 of 3' />

        <View style={[styles.container]}>
          <Text style={[styles.title, { color: theme.text.primary }]} >Review & Send</Text>

          <View style={[styles.invoiceContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
            <View style={[styles.insideContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
              <View>
                <Text style={[styles.invoiceNumber, { color: theme.text.primary }]}>{draft.invoiceNumber}</Text>
                <Text style={[styles.user, { color: theme.text.primary }]}>To: {clientName}</Text>
              </View>
              <View style={{ gap: 10, alignItems: 'flex-end' }}>
                <InvoiceStatus status={invoStatus} />
              </View>
            </View>

            <View style={[styles.invoiceTemp, { borderBottomColor: theme.border.secondary }]}>

              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.lineItems, styles.colItem, { color: theme.text.tertiary }]}>Item</Text>
                <Text style={[styles.lineItems, styles.colQty, { color: theme.text.tertiary }]}>Qty</Text>
                <Text style={[styles.lineItems, styles.colPrice, { color: theme.text.tertiary }]}>Price</Text>
                <Text style={[styles.lineItems, styles.colTotal, { color: theme.text.tertiary }]}>Total</Text>
              </View>

              {draft.lineItems?.map((item: any) => (
                <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' }}>
                  <Text style={[styles.item, styles.colItem, { color: theme.text.primary }]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                  <Text style={[styles.item, styles.colQty, { color: theme.text.primary }]}>{item.type === 'Product' ? `${item.quantity}` : `${item.quantity}h`}</Text>
                  <Text style={[styles.price, styles.colDataPrice, { color: theme.text.secondary }]}>{item.type === 'Product' ? `${item.unitPrice}$` : `${item.unitPrice}$ /h`}</Text>
                  <Text style={[styles.colPrice, { color: theme.text.primary }]}> {formatCurrency(Number(item.quantity) * Number(item.unitPrice), draft.currency)} </Text>
                </View>
              ))}
            </View>

            <View style={styles.billingBox}>
              <Text style={[styles.item, { color: theme.text.secondary }]}>Subtotal</Text>
              <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {subTotal}</Text>
            </View>

            <View style={styles.billingBox}>
              <Text style={[styles.item, { color: theme.text.secondary }]}>Tax (10%)</Text>
              <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {taxRate}</Text>
            </View>

            <View style={styles.billingBox}>
              <Text style={[styles.item, { color: theme.text.secondary }]}>Discount</Text>
              <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {discount}</Text>
            </View>

            <View style={styles.billingBox}>
              <Text style={[styles.item, { color: theme.text.secondary }]}>Grand Total</Text>
              <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {grandTotal}</Text>
            </View>
          </View>

          <View style={styles.notesContainer}>
            <Text style={[styles.label, { color: theme.text.secondary }]}>NOTES TO CLIENT</Text>
            <InputTab icon={<Ionicons name='pencil' color={theme.text.secondary} size={24} />} numberOfLines={2} multiline placeholder='Add a note...' value={notes} onChangeText={(text) => dispatch(setNotes(text))} />
          </View>

          <Text style={[styles.label, { color: theme.text.secondary }]}>INVOICE STATUS</Text>
          <Pressable onPress={() => setStatusModal(true)}>
            <InputTab placeholder='Select Status' value={invoStatus} editable={false} />
          </Pressable>

          <ModalWrapper visible={statusModal} modalTitle='Select status' data={status} labelKey='name' valueKey='value' onClose={() => setStatusModal(false)}
            onItemPress={(item) => { setStatusModal(false); dispatch(setInvoiceStatus(item.value)) }} />
        </View>

      </ScreenWrapper>
      <ScreenFooter leadingButton>
        <SimpleButton btnText='CONFIRM'
          onPress={() => { handleSubmit(finalData) }} />
      </ScreenFooter>

    </View>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: mVs(26),
    fontWeight: 'bold',
    marginTop: mVs(20),
  },
  invoiceContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: mVs(20),

    marginTop: mVs(30)
  },
  insideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceNumber: {
    fontSize: mVs(24),
    fontWeight: 600,
  },
  user: {
    fontSize: mVs(16),
    fontWeight: 'bold',
    marginTop: mVs(15)
  },
  amount: {
    fontSize: mVs(14),
    fontWeight: 500,
    marginTop: mVs(5)
  },
  label: {
    fontSize: mVs(14),
    fontWeight: 500,
  },
  lineItems: {
    fontSize: mVs(18),
    fontWeight: 'bold',
    textOverflow: 'hidden',
  },
  notesContainer: {
    marginTop: mVs(40),
    gap: 8
  },
  item: {
    fontSize: mVs(14),
    fontWeight: 500,
  },
  price: {
    fontSize: mVs(14),
    fontWeight: 500,
  },
  billingBox: {
    marginTop: mVs(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colItem: {
    width: '40%',
  },
  colQty: {
    width: '15%',
    textAlign: 'center',
  },
  colPrice: {
    width: '20%',
    textAlign: 'right',
  },
  colDataPrice: {
    width: '20%',
    textAlign: 'center',
  },
  colTotal: {
    width: '25%',
    textAlign: 'right',
  },
  invoiceTemp: {
    marginTop: 30,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  statusButton: {
    height: mVs(80),
    borderWidth: 1,
  }
})