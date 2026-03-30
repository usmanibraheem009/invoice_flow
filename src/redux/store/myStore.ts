import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

// import authReducer from "../slices/authSlice";
// import cartReducer from "../slices/cartSlice";
// import favoritesReducer from "../slices/favouriteSlice";
// import imageReducer from "../slices/imageSlice";
// import productReducer from "../slices/productSlice";
import themeReducer from "../slices/themeSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["authReducer", "favoritesReducer", "cartReducer", "themeReducer"],
};

const rootReducer = combineReducers({
    themeReducer,
    // authReducer,
    // imageReducer,
    // favoritesReducer,
    // cartReducer,
    // productsReducer: productReducer,
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