import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import imageReducer from "../slices/imageSlice";
import invoiceReducer from "../slices/invoiceSlice";
import locationReducer from "../slices/locationSlice";
import templateReducer from '../slices/templateSlice';
import themeReducer from "../slices/themeSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["authReducer", "templateReducer", "imageReducer"],
};

const rootReducer = combineReducers({
    themeReducer,
    templateReducer,
    invoiceReducer,
    imageReducer,
    locationReducer,
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

export const persistor =
    persistStore(MyStore);

export default MyStore;