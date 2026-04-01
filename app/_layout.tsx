import MyStore, { persistor } from "@/src/redux/store/myStore";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


export default function RootLayout() {
  return (
    <Provider store={MyStore}>
      <PersistGate persistor={persistor} loading={null}>
        <GestureHandlerRootView>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
