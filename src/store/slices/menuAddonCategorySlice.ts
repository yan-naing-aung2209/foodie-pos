import { MenuAddonCategoryState } from "@/types/menu-addon-category";
import { MenuAddonCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategoryState = {
  menuAddonCategory: [],
  isLoading: false,
  error: null,
};

const MenuAddonCategorySlice = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    setMenuAddonCategory: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.menuAddonCategory = action.payload;
    },
    addMenuAddonCategory: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.menuAddonCategory = [...state.menuAddonCategory, ...action.payload];
    },
    /*removeTable: (state, action: PayloadAction<Table>) => {
      state.table.filter((item) => item.id !== action.payload.id);
    }, */
  },
});

export const { setMenuAddonCategory, addMenuAddonCategory } =
  MenuAddonCategorySlice.actions;
export default MenuAddonCategorySlice.reducer;
