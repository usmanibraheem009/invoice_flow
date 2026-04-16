import { deleteExistingClient, getClientById } from '@/src/apis/clientApi'
import RevenueCard from '@/src/components/client/revenue-card'
import InvoiceCard from '@/src/components/invoice/invoice-card'
import { ScrollScreen } from '@/src/components/layout'
import ContactButton from '@/src/components/primitives/contact-button'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'
import AuthHeader from '../components/screen-header'

const invoices = [
  { id: '1', title: 'Invoice #001', status: 'PAID', price: 3400, issueDate: '30-OCT-2024' },
  { id: '2', title: 'Invoice #002', status: 'PENDING', price: 3080, issueDate: '01-DEC-2024' },
  { id: '3', title: 'Invoice #003', status: 'OVERDUE', price: 2810, issueDate: '07-FEB-2025' },
];

const ClientProfile = () => {

  const { theme } = useTheme();
  const { clientId } = useLocalSearchParams();
  const [client, setClient] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!clientId) return;
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await getClientById(clientId as string);
      const clientData = response.data;

      setClient(clientData);
    } catch (error: any) {
      console.log('error getting client data: ', error)
    }
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'NA'

    const nameParts = fullName.trim().split(' ').filter(Boolean)

    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase()
    }

    return (
      nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
  }

  const { paidAmount, unpaidAmount } = invoices.reduce(
    (acc, invoice) => {
      if (invoice.status === 'PAID') {
        acc.paidAmount += invoice.price;
      } else {
        acc.unpaidAmount += invoice.price;
      }

      return acc;
    },
    {
      paidAmount: 0,
      unpaidAmount: 0,
    }
  );

  const handleEmail = async (email: string) => {
    if (!email) return;
    const url = `mailto:${email}`;
    try {
      Linking.openURL(url);
    } catch (error: any) {
      console.log('error opening email: ', error);
    }
  };

  const handlePhone = async (phoneNumber: string) => {
    if (!phoneNumber) return;
    const url = `tel:${phoneNumber}`;
    try {
      Linking.openURL(url);
    } catch (error) {
      console.log('error opening phone: ', error);
    }
  };

  const deleteClient = async (id: string) => {
    Alert.alert('Warning', 'Delete client permanently?', [
      { text: 'cancel', style: 'cancel' },
      {
        text: 'Yes', onPress: async () => {
          dispatch(setLoading(true))
          try {
            await deleteExistingClient(id);
            dispatch(showSnackbar({
              message: 'Client deleted successfully', type: 'error'
            }));
            router.back();
          } catch (error: any) {
            console.log('delete error: ', error)
            dispatch(showSnackbar({
              message: error.message, type: error.type
            }))
          } finally {
            dispatch(setLoading(false))
          }
        }
      }
    ]);
  }

  return (
    <ScrollScreen>
      <AuthHeader arrowBack title='Profile' trailingIcon='pencil' onIconPress={() => {
        router.push({ pathname: '/screens/add-client', params: { editable: 'true', clientData: JSON.stringify(client) } });
      }} />

      <FlatList data={invoices} keyExtractor={(item) => item.id} style={{ flex: 1 }} contentContainerStyle={styles.invoiceList} showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <SimpleButton btnText='Delete client' onPress={() => { deleteClient(clientId as string) }} backgroundColor={theme.surface.tertiary} />
          </>
        }
        ListHeaderComponent={
          <>
            <View style={[styles.avatar, { borderColor: theme.surface.primary, backgroundColor: theme.background.secondary }]}>
              <Text style={styles.clientName}>{getInitials(client?.name)}</Text>
            </View>

            <View style={styles.userDetails}>
              <Text style={[styles.name, { color: theme.text.primary }]}>{client?.name || 'John'}</Text>
              <Text style={[styles.orgName, { color: theme.text.secondary }]}>Doe Labs Inc.</Text>
              <View style={styles.contactInfo}>
                <ContactButton icon={<Ionicons name='mail-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { handleEmail(client?.email) }} />
                <ContactButton icon={<Ionicons name='call-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { handlePhone(client?.phone) }} />
                <ContactButton icon={<Ionicons name='share-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: mVs(20), gap: mVs(15), marginTop: mVs(20), alignItems: 'center', justifyContent: 'center' }}>
              <RevenueCard title='Invoices' amount={unpaidAmount} />
              <RevenueCard title='Paid' amount={paidAmount} status={'PAID'} />
              <RevenueCard title='Due' amount={unpaidAmount} status='UNPAID' />
            </View>

            <Text style={[styles.history, { color: theme.text.primary }]}>History</Text>

          </>
        }
        renderItem={({ item }) => (
          <InvoiceCard title={item.title} issueDate={item.issueDate} status={item.status} price={item.price} invoiceNumber={item.title} />
        )} />

    </ScrollScreen>
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
    paddingHorizontal: mVs(20),
    marginBottom: mVs(15),
    marginTop: mVs(10),
  },
  invoiceList: {
    gap: mVs(15),
    paddingHorizontal: mVs(20),
    paddingBottom: mVs(20)
  }
})