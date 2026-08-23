import { configureStore } from "@reduxjs/toolkit";
import bulletinReducer from "../features/bulletin/store/bulletinSlice";
import couponReducer from "../features/coupon/store/couponSlice";
 
export const store = configureStore({
  reducer: {
    bulletin: bulletinReducer,
    coupon: couponReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
