import { MenuCategoryMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface MenuCategoryMenuState {
  menuCategoryMenu: MenuCategoryMenu[];
  isLoading: boolean;
  error: Error | null;
}

const initialState: MenuCategoryMenuState = {
  menuCategoryMenu: [],
  isLoading: false,
  error: null,
};

const MenuCategoryMenuSlice = createSlice({
  name: "menuCategoryMenu",
  initialState,
  reducers: {
    setMenuCategoryMenu: (state, action: PayloadAction<MenuCategoryMenu[]>) => {
      state.menuCategoryMenu = action.payload;
    },
    addMenuCategoryMenu: (state, action: PayloadAction<MenuCategoryMenu[]>) => {
      state.menuCategoryMenu = [...state.menuCategoryMenu, ...action.payload];
    },
    /*
    removeTable: (state, action: PayloadAction<Table>) => {
      state.table.filter((item) => item.id !== action.payload.id);
    }, */
  },
});

export const { setMenuCategoryMenu, addMenuCategoryMenu } =
  MenuCategoryMenuSlice.actions;
export default MenuCategoryMenuSlice.reducer;
