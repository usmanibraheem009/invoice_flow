import ClientCard from '@/src/components/client/client-card'
import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import FloatingButton from '@/src/components/primitives/floating-button'
import InputTab from '@/src/components/primitives/input-tab'
import useTheme from '@/src/hooks/useTheme'
import { Client } from '@/src/redux/slices/clientsSlice'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

const clients = () => {
  
  const clients = useSelector((state :any) => state.clientsReducer.clients);
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(clients);

  useEffect(() => {
    if (search === '') {
      setFilteredItems(clients);
    } else {
      const filtered = clients.filter((item : Client) =>
        item.clientName.toLowerCase().includes(search.toLowerCase()) ||
        item.orgName?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [search]);

  const handleNavigation = () => {
    router.push({
      pathname: '/screens/client-profile',
      params: {

      }
    })
  }

  return (
    <ScreenWrapper>
      <AuthHeader title='Clients' />
      <FloatingButton icon='person-add' onPress={() => { router.push('/screens/add-client') }} />
      <View style={{ paddingHorizontal: mVs(20), paddingBottom: mVs(60) }}>
        <InputTab placeholder='Search...' value={search} onChangeText={setSearch}
          icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />} />

        <FlatList data={filteredItems} keyExtractor={(item: any) => item.id} showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ClientCard clientName={item.clientName} organizationName={item.orgName} createdAt={'Oct 12'} totalRevenue={'34.2k'} profileImage={item.profileImage} onPressed={() => router.push('/screens/client-profile')} />
        )} />
      </View>

    </ScreenWrapper>
  )
}

export default clients

const styles = StyleSheet.create({

})