import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../slices/authSlice";
import clientsReducer from "../slices/clientsSlice";
import imageReducer from "../slices/imageSlice";
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
    whitelist: ["authReducer", "templateReducer", "imageReducer", "clientsReducer", "productsReducer", "organizationReducer"],
};

const rootReducer = combineReducers({
    themeReducer,
    templateReducer,
    invoiceReducer,
    imageReducer,
    locationReducer,
    clientsReducer,
    loadingReducer,
    productsReducer,
    authReducer,
    userReducer,
    snackbarReducer,
    organizationReducer,
});

const persistedReducer =
    persistReducer(persistConfig, rootReducer);

const MyStore = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(MyStore);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof MyStore.dispatch;

export default MyStore;