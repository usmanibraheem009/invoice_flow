import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-native-paper';

const _layout = () => {
  return (
    <Provider>
        <Tabs>
            <Tabs.Screen options={{title: 'Dash', headerShown: false, tabBarIcon: (color:any) => (<MaterialIcons name='dashboard' color={'grey'} size={24}/>)}} name='index'/>
            <Tabs.Screen options={{title: 'Invoices', headerShown: false, tabBarIcon: (color:any) => (<MaterialIcons name='receipt' color={'grey'} size={24}/>)}} name='invoices'/>
            <Tabs.Screen options={{title: 'Clients', headerShown: false, tabBarIcon: (color:any) => (<MaterialIcons name='verified-user' color={'grey'} size={24}/>)}} name='clients'/>
            <Tabs.Screen options={{title: 'Reports', headerShown: false, tabBarIcon: (color:any) => (<MaterialIcons name='bar-chart' color={'grey'} size={24}/>)}} name='reports'/>
            <Tabs.Screen options={{title: 'Settings', headerShown: false, tabBarIcon: (color:any) => (<MaterialIcons name='settings' color={'grey'} size={24}/>)}} name='settings'/>
        </Tabs>
    </Provider>
  )
}

export default _layout