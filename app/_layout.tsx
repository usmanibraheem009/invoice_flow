import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from "react-native-paper";


export default function RootLayout() {
  return (
    <Provider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
        </Stack>
      </GestureHandlerRootView>
    </Provider>
  );
}
