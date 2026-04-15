import { fetchClients } from '@/src/apis/clientApi'
import ClientCard from '@/src/components/client/client-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import InputTab from '@/src/components/primitives/input-tab'
import { useTheme } from '@/src/hooks/useTheme'
import { Client, setClients } from '@/src/redux/slices/clientsSlice'
import AuthHeader from '@/src/ui/components/screen-header'
import { dateformatter } from '@/src/utils/date-formatter'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

const clients = () => {

  const clients = useSelector((state: any) => state.clientsReducer.clients);
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredItems, setFilteredItems] = useState(clients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (search === '') {
      setFilteredItems(clients);
    } else {
      const filtered = clients.filter((item: Client) =>
        item.clientName.toLowerCase().includes(search.toLowerCase()) ||
        item.orgName?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [search, clients]);

  useEffect(() => {
    loadClients();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadClients();

    setRefreshing(false);
  }

  const loadClients = async () => {
    try {
      const response = await fetchClients();
      const apiClients = response.data.data;
      console.log('fetched clients: ', apiClients)

      const mappedClients = apiClients.map((item: any) => ({
        id: item.id,
        clientName: item.name,
        clientEmail: item.email,
        phone: item.phone,
        addressLine1: item.addressLine1,
        country: item.country,
        state: item.state,
        city: item.city,
        postalCode: item.postalCode,
        createdAt: item.createdAt
      })).filter((item: any) => item.id && item.clientName)

      dispatch(setClients(mappedClients));
    } catch (error: any) {
      console.log('Error fetching clients: ', error);
    }
  };

  return (
    <ScreenWrapper keyboardAvoidingView>
      <AuthHeader title='Clients' />
      <FloatingButton icon='person-add' onPress={() => { router.push('/screens/add-client') }} />
      <View style={{ paddingHorizontal: mVs(20), paddingBottom: mVs(20), flex: 1 }}>
        <InputTab placeholder='Search...' value={search} onChangeText={setSearch}
          icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />}
        />

        <FlatList data={filteredItems} refreshing={refreshing} onRefresh={onRefresh} keyExtractor={(item: any) => item.id} showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ClientCard clientName={item.clientName} organizationName={item.addressLine1} createdAt={dateformatter(item.createdAt)}
              totalRevenue={'34.2k'} onPressed={() => router.push({
                pathname: '/screens/client-profile',
                params: {
                  clientId: item.id
                }
              })} />
          )} />
      </View>

    </ScreenWrapper>
  )
}

export default clients

const styles = StyleSheet.create({

})