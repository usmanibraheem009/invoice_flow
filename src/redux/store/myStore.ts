import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import authReducer from "../slices/authSlice";
import clientsReducer from "../slices/clientsSlice";
import invoicesListReducer from "../slices/invoiceListSlice";
import invoiceReducer from "../slices/invoiceSlice";
import loadingReducer from "../slices/loadingSlice";
import locationReducer from "../slices/locationSlice";
import organizationReducer from "../slices/organizationSlice";
import productsReducer from "../slices/productsSlice";
import snackbarReducer from "../slices/snackbarSlice";
import templateReducer from '../slices/templateSlice';
import themeReducer from "../slices/themeSlice";
import userReducer from "../slices/userSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["authReducer", "templateReducer", "themeReducer"],
};

const rootReducer = combineReducers({
    themeReducer,
    templateReducer,
    invoiceReducer,
    locationReducer,
    clientsReducer,
    loadingReducer,
    productsReducer,
    authReducer,
    userReducer,
    snackbarReducer,
    organizationReducer,
    invoicesListReducer,
    // clientsInvoicesReducer
});

const persistedReducer =
    persistReducer(persistConfig, rootReducer);

const MyStore = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(MyStore);

export type RootState = ReturnType<typeof MyStore.getState>;
export type AppDispatch = typeof MyStore.dispatch;

export default MyStore;