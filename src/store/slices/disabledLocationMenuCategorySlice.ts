import { DisabledLocationMenuCategoryState } from "@/types/disabled-location-menu-category";
import { DisabledLocationMenuCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuCategoryState = {
  disabledLocationMenuCategories: [],
  isLoading: false,
  error: null,
};

const disabledLocationMenuCategorySlice = createSlice({
  name: "disabledLocationMenuCategory",
  initialState,
  reducers: {
    setdisabledLocationMenuCategory: (
      state,
      action: PayloadAction<DisabledLocationMenuCategory[]>
    ) => {
      state.disabledLocationMenuCategories = action.payload;
    },
  },
});

export const { setdisabledLocationMenuCategory } =
  disabledLocationMenuCategorySlice.actions;
export default disabledLocationMenuCategorySlice.reducer;
