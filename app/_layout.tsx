import MyStore, { persistor } from "@/src/redux/store/myStore";
import AppContent from "@/src/ui/screens/app-content";
import SnackBar from "@/src/utils/snackbar";
import React from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


export default function RootLayout() {
  return (
    <PaperProvider>

      <Provider store={MyStore}>
        <PersistGate persistor={persistor} loading={null}>
          <AppContent />
          <SnackBar />
        </PersistGate>
      </Provider>
    </ PaperProvider>
  );
}
