import { deleteExistingClient, getClientById } from '@/src/apis/clientApi'
import { getInvoicesByClientId } from '@/src/apis/invoiceApi'
import RevenueCard from '@/src/components/client/revenue-card'
import InvoiceCard from '@/src/components/invoice/invoice-card'
import { Screen } from '@/src/components/layout'
import ContactButton from '@/src/components/primitives/contact-button'
import SimpleButton from '@/src/components/primitives/simple-button'
import { useTheme } from '@/src/hooks/useTheme'
import { setLoading } from '@/src/redux/slices/loadingSlice'
import { showSnackbar } from '@/src/redux/slices/snackbarSlice'
import { dateformatter } from '@/src/utils/date-formatter'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import AuthHeader from '../components/screen-header'


const ClientProfile = () => {

  const { theme } = useTheme();
  const { t } = useTranslation();
  const { clientId } = useLocalSearchParams();
  const [invoices, setInvoices] = useState<any[]>([]);
  console.log("client invoices data: ", invoices);


  useEffect(() => {
    if (!clientId) return;
    fetchClient();
    fetchClientInvoices();
  }, [clientId]);

  const fetchClientInvoices = async () => {
    try {
      const response = await getInvoicesByClientId(clientId as string);
      setInvoices(response.data.data);
    } catch (error: any) {
      dispatch(showSnackbar({ message: error.message, type: 'error' }))
    }
  };

  const totalInvoices = invoices.length;
  const paidAmount = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);
  const unpaidAmount = invoices.filter(inv => inv.status !== 'PAID').reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);

  const [client, setClient] = useState<any>(null);
  const dispatch = useDispatch();

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
    Alert.alert(`${t('common.warning')}`, `${t('common.areYouSure', { param: `${t('clients.client')}` })}`, [
      { text: `${t('common.cancel')}`, style: 'cancel', },
      {
        text: `${t('common.yes')}`, style: 'destructive', onPress: async () => {
          dispatch(setLoading(true))
          try {
            await deleteExistingClient(id);
            dispatch(showSnackbar({
              message: `${t('common.deletedMessage', { param: `${t('clients.client')}` })}`, type: 'error'
            }));
            router.back();
          } catch (error: any) {
            dispatch(showSnackbar({
              message: error.message, type: error.type
            }))
          } finally {
            dispatch(setLoading(false))
          }
        }
      }
    ]);
  };

  if (!client) {
    return (
      <Screen>
        <ActivityIndicator size='large' color={theme.text.secondary} style={{ marginTop: mVs(50) }} />
        <Text>{t('clients.clientNotFound')}</Text>
      </Screen>
    )
  }

  return (
    <Screen>
      <AuthHeader arrowBack title={t('clients.clientDetails')} trailingIcon='pencil' onIconPress={() => {
        router.push({ pathname: '/screens/add-client', params: { editable: 'true', clientData: JSON.stringify(client) } });
      }} />

      <FlatList data={invoices} keyExtractor={(item: any) => item.id} style={{ flex: 1 }} contentContainerStyle={styles.invoiceList} showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <SimpleButton btnText={t('clients.deleteClient')} onPress={() => { deleteClient(clientId as string) }} backgroundColor={theme.surface.tertiary} />
          </>
        }
        ListHeaderComponent={
          <>
            <View style={[styles.avatar, { borderColor: theme.surface.primary, backgroundColor: theme.surface.secondary }]}>
              <Text style={styles.clientName}>{getInitials(client?.name)}</Text>
            </View>

            <View style={styles.userDetails}>
              <Text style={[styles.name, { color: theme.text.primary }]}>{client?.name || 'John'}</Text>
              <Text style={[styles.orgName, { color: theme.text.secondary }]}>{client?.email}</Text>
              <View style={styles.contactInfo}>
                <ContactButton icon={<Ionicons name='mail-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { handleEmail(client?.email) }} />
                <ContactButton icon={<Ionicons name='call-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { handlePhone(client?.phone) }} />
                <ContactButton icon={<Ionicons name='share-outline' size={mVs(30)} color={theme.text.primary} />} onPress={() => { }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: mVs(20), gap: mVs(15), marginTop: mVs(20), alignItems: 'center', justifyContent: 'center' }}>
              <RevenueCard title={t('invoice.invoices')} amount={totalInvoices} />
              <RevenueCard title={t('invoice.paid')} amount={paidAmount} status={'PAID'} currency />
              <RevenueCard title={t('invoice.pending')} amount={unpaidAmount} status='UNPAID' currency />
            </View>

            <Text style={[styles.history, { color: theme.text.primary }]}>{t('common.history')}</Text>

          </>
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyText}>
            <Text style={{ color: theme.text.primary, fontSize: mVs(16) }}>{t('invoice.noInvoiceHistory')}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <InvoiceCard title={item.client.name} issueDate={dateformatter(item.issueDate)} status={item.status} price={item.totalAmount} invoiceNumber={item.invoiceNumber} />
        )} />

    </Screen>
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
    marginBottom: mVs(10),
    marginTop: mVs(10),
  },
  invoiceList: {
    gap: mVs(15),
    paddingHorizontal: mVs(20),
    paddingBottom: mVs(20)
  },
  emptyText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mVs(50)
  }
})