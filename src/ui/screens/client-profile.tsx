import InvoiceCard from '@/src/components/invoice/invoice-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import ContactButton from '@/src/components/primitives/contact-button'
import useTheme from '@/src/hooks/useTheme'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import AuthHeader from '../components/screen-header'

const invoices = [
  { id: '1', title: 'Invoice #001', status: 'PAID', price: 3400, issueDate: '30-OCT-2024' },
  { id: '2', title: 'Invoice #002', status: 'PENDING', price: 3080, issueDate: '01-DEC-2024' },
  { id: '3', title: 'Invoice #003', status: 'OVERDUE', price: 2810, issueDate: '07-FEB-2025' },

];

const ClientProfile = () => {

  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <AuthHeader arrowBack title='Profile' trailingIcon='pencil' />
      <View style={[styles.avatar, { borderColor: theme.surface.primary, backgroundColor: theme.background.secondary }]}>
        <Text style={styles.clientName}>JD</Text>
      </View>

      <View style={styles.userDetails}>
        <Text style={[styles.name, { color: theme.text.primary }]}>John Doe</Text>
        <Text style={[styles.orgName, { color: theme.text.secondary }]}>Doe Labs Inc.</Text>
        <View style={styles.contactInfo}>
          <ContactButton icon={<Ionicons name='mail-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { }} />
          <ContactButton icon={<Ionicons name='call-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { }} />
          <ContactButton icon={<Ionicons name='share-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { }} />
        </View>
      </View>

      <View>
        
      </View>

      <View style={styles.invoiceList}>
        <FlatList data={invoices} keyExtractor={(item) => item.id} contentContainerStyle={{gap: mVs(15), paddingHorizontal: mVs(20)}}
        ListHeaderComponent={<Text style={[styles.history,{color: theme.text.primary}]}>History</Text>}
          renderItem={({ item }) => (
            <InvoiceCard title={item.title} issueDate={item.issueDate} status={item.status} price={item.price} invoiceNumber={item.title} />
          )} />
      </View>

    </ScreenWrapper>
  )
}

export default ClientProfile

const styles = StyleSheet.create({
  avatar: {
    height: mVs(120),
    width: mVs(120),
    borderRadius: mVs(100),
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: mVs(10),
    alignSelf: 'center'
  },
  clientName: {
    fontSize: mVs(36),
    fontWeight: 'bold',
    color: '#ffff'
  },
  userDetails: {
    gap: mVs(15),
    alignSelf: 'center',
    marginTop: mVs(10),
    alignItems: 'center',
  },
  name: {
    fontSize: mVs(26),
    fontWeight: 600
  },
  orgName: {
    fontSize: mVs(14),
    fontWeight: 400,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: mVs(25),
    marginTop: mVs(10)
  },
  history: {
    fontSize: mVs(26),
    fontWeight: 'bold',
  },
  invoiceList: {
    marginTop: mVs(30)
  }
})