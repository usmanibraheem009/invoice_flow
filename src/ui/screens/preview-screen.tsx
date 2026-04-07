import InvoiceStatus from '@/src/components/invoice/invoice-status'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import InputTab from '@/src/components/primitives/input-tab'
import SimpleButton from '@/src/components/primitives/simple-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ScreenFooter from '../components/screen-footer'
import AuthHeader from '../components/screen-header'

const PreviewScreen = () => {

  const { theme } = useTheme();
  const [notes, setNotes] = useState('');
  const { invoiceData } = useLocalSearchParams<{ invoiceData: string }>();
  const parsedInvoice = invoiceData ? JSON.parse(invoiceData) : null;
  const tax = parsedInvoice.subTotal * 10 / 100;
  const discount = parsedInvoice.subTotal > 1500? parsedInvoice.subTotal * 5 / 100 : 0;
  const grandTotal = (parsedInvoice.subTotal + tax -discount).toFixed(2);

  return (
    <>
    <ScreenWrapper scrollable paddingVertical={10}>
      <AuthHeader arrowBack title='Step 3 of 3' />

      <View style={[styles.container]}>
        <Text style={[styles.title, { color: theme.text.primary }]} >Review & Send</Text>

        <View style={[styles.invoiceContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
          <View style={[styles.insideContainer, { backgroundColor: theme.background.secondary, borderColor: theme.border.secondary }]}>
            <View>
              <Text style={[styles.invoiceNumber, { color: theme.text.primary }]}>{parsedInvoice.invoiceNumber}</Text>
              <Text style={[styles.user, { color: theme.text.primary }]}>To: {parsedInvoice.clientName}</Text>
            </View>
            <View style={{ gap: 10, alignItems: 'flex-end' }}>
              <InvoiceStatus status='DRAFT' />
            </View>
          </View>

          <View style={[styles.invoiceTemp, {borderBottomColor: theme.border.secondary}]}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.lineItems, styles.colItem, { color: theme.text.tertiary }]}>Item</Text>
              <Text style={[styles.lineItems, styles.colQty, { color: theme.text.tertiary }]}>Qty</Text>
              <Text style={[styles.lineItems, styles.colPrice, { color: theme.text.tertiary }]}>Price</Text>
              <Text style={[styles.lineItems, styles.colTotal, { color: theme.text.tertiary }]}>Total</Text>
            </View>

            {parsedInvoice.items?.map((item: any) => (
              <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, width: '100%' }}>
                <Text style={[styles.item, styles.colItem, { color: theme.text.primary }]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
                <Text style={[styles.item, styles.colQty, { color: theme.text.primary }]}>{item.type === 'Product' ? `${item.quantity}` : `${item.quantity}h`}</Text>
                <Text style={[styles.price, styles.colDataPrice, { color: theme.text.secondary }]}>{item.type === 'Product' ? `${item.price}$` : `${item.price}$ /h`}</Text>
                <Text style={[styles.colPrice, { color: theme.text.primary }]}> ${item.total} </Text>
              </View>
            ))}
          </View>

          <View style={styles.billingBox}>
            <Text style={[styles.item, { color: theme.text.secondary }]}>Subtotal</Text>
            <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {parsedInvoice.subTotal}</Text>
          </View>

          <View style={styles.billingBox}>
            <Text style={[styles.item, { color: theme.text.secondary }]}>Tax (10%)</Text>
            <Text style={[styles.amount, { color: theme.text.secondary }]}>$ {tax}</Text>
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
          <InputTab icon={<Ionicons name='pencil' color={theme.text.secondary} size={24} />} placeholder='Add a note...' value={notes} onChangeText={setNotes}/>
        </View>

      </View>

    </ScreenWrapper>

      <ScreenFooter backButton>
        <SimpleButton btnText='CONFIRM' onPress={() => { 
          const mergedData = {...parsedInvoice, tax, discount, grandTotal, notes};
          router.replace({
          pathname: '/screens/template-screen',
          params: {
            invoiceData: JSON.stringify(mergedData),
          }
          }) }} />
      </ScreenFooter>

      </>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
})