import { combineReducers, configureStore } from "@reduxjs/toolkit";
import bulletinReducer from "../features/bulletin/store/bulletinSlice";
import couponReducer from "../features/coupon/store/couponSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "bulletinRoot",
  storage,
};

const rootReducer = combineReducers({
  bulletin: bulletinReducer,
  coupon: couponReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
