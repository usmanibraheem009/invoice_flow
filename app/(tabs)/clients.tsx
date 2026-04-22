import ClientCard from '@/src/components/client/client-card'
import { Screen } from '@/src/components/layout'
import FloatingButton from '@/src/components/primitives/floating-button'
import InputTab from '@/src/components/primitives/input-tab'
import { useTheme } from '@/src/hooks/useTheme'
import { Client } from '@/src/redux/slices/clientsSlice'
import { loadClients } from '@/src/redux/thunks/client-thunk'
import AuthHeader from '@/src/ui/components/screen-header'
import { dateformatter } from '@/src/utils/date-formatter'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
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
    dispatch(loadClients() as any);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    dispatch(loadClients() as any);

    setRefreshing(false);
  }

  return (
    <Screen>
      <AuthHeader title='Clients' />
      <FloatingButton icon='person-add' onPress={() => { router.push('/screens/add-client') }} />
      <View style={{ paddingHorizontal: mVs(20), paddingBottom: mVs(20), flex: 1 }}>
        <InputTab placeholder='Search...' value={search} onChangeText={setSearch}
          icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />}
        />

        <FlatList data={filteredItems} refreshing={refreshing} onRefresh={onRefresh} keyExtractor={(item: any) => item.id} showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: mVs(50) }}>
              <Text style={{ color: theme.text.primary, fontSize: mVs(16) }}>No Clients found. Tap + to add one</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ClientCard clientName={item.clientName} organizationName={item.addressLine1} createdAt={dateformatter(item.createdAt)}
              totalRevenue={''} onPressed={() => router.push({
                pathname: '/screens/client-profile',
                params: {
                  clientId: item.id
                }
              })} />
          )} />
      </View>

    </Screen>
  )
}

export default clients

const styles = StyleSheet.create({

})