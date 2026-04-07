import ScreenWrapper from '@/src/components/layout/screen-wrapper'
import ClientCard from '@/src/components/primitives/client-card'
import FloatingButton from '@/src/components/primitives/floating-button'
import InputTab from '@/src/components/primitives/input-tab'
import useTheme from '@/src/hooks/useTheme'
import AuthHeader from '@/src/ui/components/screen-header'
import { mVs } from '@/src/utils/scale'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'

const clients = () => {

  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState();

  const clientData = [
    {id: 1, clientName: 'John Doe', organizationName: 'Doe Labs', createdAt: 'Oct 12', totalRevenue: '14.2k'},
    {id: 2, clientName: 'Sarah Connor', organizationName: 'Skynet Sol', createdAt: 'Sep 13', totalRevenue: '32.4k'},
    {id: 3, clientName: 'Peter Parker', organizationName: 'Daily Bugle', createdAt: 'Oct 15', totalRevenue: '26.3k'},
  ]

  return (
    <ScreenWrapper paddingHorizontal={mVs(20)}>
      <AuthHeader title='Clients' />
      <InputTab placeholder='Search...' value=''
      icon={<Ionicons name='search' size={mVs(24)} color={theme.text.primary} />} />
      <FloatingButton icon='person-add' onPress={() => { router.push('/screens/add-client') }} />

      <FlatList data={clientData} keyExtractor={(item : any) => item.id} renderItem={({item}) => (
        <ClientCard clientName={item.clientName} organizationName={item.organizationName} createdAt={item.createdAt} totalRevenue={item.totalRevenue} onPressed={() => router.push('/screens/client-profile')}/>
      )} />
    </ScreenWrapper>
  )
}

export default clients

const styles = StyleSheet.create({

})