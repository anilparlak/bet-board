import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../../../app/store";
import type { ICouponItem } from "../types/coupon.types";

interface CouponState {
  items: Record<string, ICouponItem>;
}

const initialState: CouponState = {
  items: {},
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    toggleOutcome: (state, action: PayloadAction<ICouponItem>) => {
      const item = action.payload;
      const current = state.items[item.eventId];

      if (current && current.outcomeId === item.outcomeId && current.marketId === item.marketId) {
        delete state.items[item.eventId];
        return;
      }

      state.items[item.eventId] = item;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clearCoupon: (state) => {
      state.items = {};
    },
  },
});

export const { toggleOutcome, removeItem, clearCoupon } = couponSlice.actions;

export const selectCouponItems = (state: RootState) => state.coupon.items;

export const selectSelectionKey = (eventId: string) => (state: RootState) => {
  const item = state.coupon.items[eventId];
  return item ? `${item.marketId}:${item.outcomeId}` : undefined;
};

export default couponSlice.reducer;
