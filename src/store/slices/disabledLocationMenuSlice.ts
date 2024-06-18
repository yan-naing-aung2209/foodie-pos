import { DisabledLocationMenuState } from "@/types/disabled-location-menu";
import { DisabledLocationMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuState = {
  disabledLocationMenu: [],
  isLoading: false,
  error: null,
};

const disabledLocationMenuSlice = createSlice({
  name: "disabledLocationMenu",
  initialState,
  reducers: {
    setdisabledLocationMenu: (
      state,
      action: PayloadAction<DisabledLocationMenu[]>
    ) => {
      state.disabledLocationMenu = action.payload;
    },
  },
});

export const { setdisabledLocationMenu } = disabledLocationMenuSlice.actions;
export default disabledLocationMenuSlice.reducer;
