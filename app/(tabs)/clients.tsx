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
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

const Clients = () => {

  const clients = useSelector((state: any) => state.clientsReducer.clients);
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredItems, setFilteredItems] = useState(clients);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

    await dispatch(loadClients() as any);

    setRefreshing(false);
  }

  if (!clients) {
    return (<Screen>
      <ActivityIndicator size={'large'} color={theme.text.secondary} />
    </Screen>)
  }

  return (
    <Screen>
      <AuthHeader title={t('clients.title')} />
      <FloatingButton icon='person-add' onPress={() => { router.push('/screens/add-client') }} />
      <View style={{ paddingHorizontal: mVs(20), paddingBottom: mVs(20), flex: 1 }}>
        <InputTab placeholder={t('common.search')} value={search} onChangeText={setSearch}
          icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />}
        />

        <FlatList data={filteredItems} refreshing={refreshing} onRefresh={onRefresh} keyExtractor={(item: any) => item.id} showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (<Text style={[styles.dummyText, { color: theme.text.secondary }]}>{t('common.dummyText', { param: t('clients.title') })}</Text>)}
          renderItem={({ item }) => (
            <ClientCard clientName={item.clientName} organizationName={item.addressLine1} createdAt={dateformatter(item.createdAt)}
              totalRevenue={0} onPressed={() => router.push({
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

export default Clients

const styles = StyleSheet.create({
  dummyText: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: mVs(16),
    fontWeight: 500
  }
})