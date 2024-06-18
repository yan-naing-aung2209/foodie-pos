import { config } from "@/config";
import { Menu } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateMenuPayload,
  DeleteMenuPayload,
  MenuState,
  UpdateMenuPayload,
} from "../../types/menu";
import { setdisabledLocationMenu } from "./disabledLocationMenuSlice";
import {
  addMenuCategoryMenu,
  setMenuCategoryMenu,
} from "./menuCategoryMenuSlice";

const initialState: MenuState = {
  menus: [],
  isLoading: false,
  error: null,
};

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (payload: CreateMenuPayload, thunkAPI) => {
    const { onSuccess, ...menuData } = payload;

    const { name, price, menuCategoryIds } = menuData;
    const valid = name && price !== undefined && menuCategoryIds.length > 0;

    if (!valid) {
      return alert("menu name and price are required!");
    }

    const response = await fetch(`${config.backofficeApiBaseUrl}/menu`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(payload),
    });
    const responseData = await response.json();

    const { menu, menuCategoryMenus } = responseData;

    thunkAPI.dispatch(addMenu(menu));
    thunkAPI.dispatch(addMenuCategoryMenu(menuCategoryMenus));

    onSuccess && onSuccess();

    return menu;
  }
);
export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async (payload: UpdateMenuPayload, thunkAPI) => {
    const { onSuccess, ...menuData } = payload;

    const { id, name, price, menuCategoryIds, locationId } = menuData;

    const valid =
      id &&
      name &&
      price !== undefined &&
      menuCategoryIds.length > 0 &&
      locationId;

    if (!valid) {
      return window.alert("menu name and price are required!");
    }

    const response = await fetch(`${config.backofficeApiBaseUrl}/menu`, {
      headers: { "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(menuData),
    });

    const responseData = await response.json();

    const { updatedMenu, disabledLocationMenu, menuCategoryMenu } =
      responseData;

    thunkAPI.dispatch(replaceMenu(updatedMenu));
    disabledLocationMenu &&
      thunkAPI.dispatch(setdisabledLocationMenu(disabledLocationMenu));
    menuCategoryMenu &&
      thunkAPI.dispatch(setMenuCategoryMenu(menuCategoryMenu));
    onSuccess && onSuccess();
  }
);
export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (payload: DeleteMenuPayload, thunkAPI) => {
    const { onSuccess, menuId } = payload;

    if (!menuId) {
      return alert("incorrect route.");
    }

    await fetch(`${config.backofficeApiBaseUrl}/menu?id=${menuId}`, {
      method: "DELETE",
    });
    thunkAPI.dispatch(removeMenu(menuId));
    onSuccess && onSuccess();

    //return menu; -->extra reducer
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload;
    },
    addMenu: (state, action: PayloadAction<Menu>) => {
      state.menus = [...state.menus, action.payload];
    },
    replaceMenu: (state, action: PayloadAction<Menu>) => {
      state.menus = state.menus.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
  },
  /* extraReducers: (builder) => {
    builder
      .addCase(createMenu.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus = [...state.menus, action.payload];
        state.isLoading = false;
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.isLoading = false;
        const err = new Error("createMenu error occurred");
        state.error = err.message;
      });
  }, */
});

export const { setMenu, addMenu, removeMenu, replaceMenu } = menuSlice.actions;

export default menuSlice.reducer;
