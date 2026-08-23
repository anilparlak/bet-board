import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../../app/store";

import { fetchBets } from "../api/bets/betsApi";
import type { IBetEvent } from "../types/betsApi.types";

type Status = "idle" | "loading" | "ready" | "failed";

interface BulletinState {
  betsData: IBetEvent[] | null;
  status: Status;
  error: string | null;
}

const initialState: BulletinState = {
  betsData: [],
  status: "idle",
  error: null,
};


export const fetchBulletin = createAsyncThunk(
  "bulletin/fetch",
  async () => {
    return await fetchBets();
  },
  {
    condition: (_arg, { getState }) =>
      (getState() as RootState).bulletin.status !== "loading",
  }
);

const bulletinSlice = createSlice({
  name: "bulletin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBulletin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBulletin.fulfilled, (state, action) => {
        state.status = "ready";
        state.betsData = action?.payload?.length > 0 ? [...action.payload] : []
      })
      .addCase(fetchBulletin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "An unknown error occurred!";
      });
  },
});

export const selectBetsData = (state: RootState) => state.bulletin.betsData;
export const selectStatus = (state: RootState) => state.bulletin.status;
export const selectError = (state: RootState) => state.bulletin.error;

export default bulletinSlice.reducer;
