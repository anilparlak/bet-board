import { configureStore } from "@reduxjs/toolkit";
import bulletinReducer from "../features/bulletin/store/bulletinSlice";
 
export const store = configureStore({
  reducer: {
    bulletin: bulletinReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
