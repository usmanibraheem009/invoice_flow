import { useTheme } from '@/src/hooks/useTheme';
import MyStore from '@/src/redux/store/myStore';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';

const _layout = () => {
  const { theme } = useTheme();
  return (
    <PaperProvider>

      <Provider store={MyStore}>
        <Tabs screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.background.secondary,
            borderTopColor: theme.border.primary,
            height: mVs(70),
            paddingTop: 5
          },
          tabBarActiveTintColor: theme.surface.primary,
          tabBarInactiveTintColor: theme.text.disableText
        }}>
          <Tabs.Screen options={{ title: 'Dash', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'grid' : 'grid-outline'} color={color} size={24} />) }} name='index' />
          <Tabs.Screen options={{ title: 'Invoices', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'receipt' : 'receipt-outline'} color={color} size={24} />) }} name='invoices' />
          <Tabs.Screen options={{ title: 'Clients', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={24} />) }} name='clients' />
          <Tabs.Screen options={{ title: 'Reports', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} color={color} size={24} />) }} name='reports' />
          <Tabs.Screen options={{ title: 'Products', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'cube' : 'cube-outline'} color={color} size={24} />) }} name='products' />
          <Tabs.Screen options={{ title: 'Settings', headerShown: false, tabBarIcon: ({ color, focused }: any) => (<Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24} />) }} name='settings' />
        </Tabs>
      </Provider>
    </PaperProvider>
  )
}

export default _layout