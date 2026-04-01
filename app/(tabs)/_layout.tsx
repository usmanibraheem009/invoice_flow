import useTheme from '@/src/hooks/useTheme';
import MyStore from '@/src/redux/store/myStore';
import { mVs } from '@/src/utils/scale';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';

const _layout = () => {
  const { theme } = useTheme();
  return (
    <Provider store={MyStore}>
        <Tabs screenOptions={{tabBarStyle: {
          backgroundColor: theme.background.secondary,
          borderTopColor: theme.border.primary,
          height: mVs(70),
          paddingTop: 5
        },
        tabBarActiveTintColor: theme.surface.primary,
        tabBarInactiveTintColor: theme.text.disableText}}>
            <Tabs.Screen options={{title: 'Dash', headerShown: false, tabBarIcon: ({color}:any) => (<Ionicons name='grid-outline' color={color} size={24}/>)}} name='index'/>
            <Tabs.Screen options={{title: 'Invoices', headerShown: false, tabBarIcon: ({color}:any) => (<Ionicons name='receipt-outline' color={color} size={24}/>)}} name='invoices'/>
            <Tabs.Screen options={{title: 'Clients', headerShown: false, tabBarIcon: ({color}:any) => (<Ionicons name='people-outline' color={color} size={24}/>)}} name='clients'/>
            <Tabs.Screen options={{title: 'Reports', headerShown: false, tabBarIcon: ({color}:any) => (<Ionicons name='bar-chart' color={color} size={24}/>)}} name='reports'/>
            <Tabs.Screen options={{title: 'Settings', headerShown: false, tabBarIcon: ({color}:any) => (<Ionicons name='settings-outline' color={color} size={24}/>)}} name='settings'/>
        </Tabs>
    </Provider>
  )
}

export default _layout