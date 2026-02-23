import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
// import cartReducer from "../features/auth/cartSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_APP_REDUX_SECRET_KEY,
  onError: function (error) {
    // console.log(error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    // , "cart"
  ],
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  auth: authReducer,
  // cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
