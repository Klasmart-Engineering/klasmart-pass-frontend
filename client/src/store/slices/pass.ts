import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export interface Pass {
  passId: string;
  title: string;
  productIds: string[];
  price: string;
  currency: string;
  duration: number;
  durationMS: number;
}

interface PassState {
  allPasses: Pass[];
}

const initialState: PassState = { allPasses: [] };

const PassSlice = createSlice({
  name: "Pass",
  initialState,
  reducers: {
    setAllPasses(state, action: PayloadAction<{ allPasses: Pass[] }>) {
      state.allPasses = action.payload.allPasses;
    },
  },
});

export const { setAllPasses } = PassSlice.actions;

export default PassSlice.reducer;
