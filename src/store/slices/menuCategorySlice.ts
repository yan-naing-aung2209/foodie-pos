import { config } from "@/config";
import {
  CreateMenuCategoryPayload,
  DeleteMenuCategoryPayload,
  MenuCategoryState,
  UpdateMenuCategoryPayload,
} from "@/types/menu-category";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setdisabledLocationMenuCategory } from "./disabledLocationMenuCategorySlice";

const initialState: MenuCategoryState = {
  menuCategories: [],
  isLoading: false,
  error: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/createMenuCategory",
  async (payload: CreateMenuCategoryPayload, thunkAPI) => {
    const { onSuccess, onError, ...data } = payload;

    const { name, isAvailable, companyId } = data;

    const valid = name && companyId && isAvailable !== undefined;
    if (!valid) {
      return alert("name is required!");
    }

    const response = await fetch(
      `${config.backofficeApiBaseUrl}/menu-category`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const { menuCategory } = await response.json();

    onSuccess && onSuccess();
    thunkAPI.dispatch(addMenuCategory(menuCategory));
  }
);
export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (payload: UpdateMenuCategoryPayload, thunkAPI) => {
    const { onSuccess, ...data } = payload;

    const { id, name, isAvailable, locationId } = data;

    const valid = id && name && isAvailable !== undefined && locationId;
    if (!valid) {
      return alert("Some fields are required!");
    }

    const response = await fetch(
      `${config.backofficeApiBaseUrl}/menu-category`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    const { updatedMenuCategory, disabledLocationMenuCategory } =
      await response.json();

    thunkAPI.dispatch(replaceMenuCategory(updatedMenuCategory));
    disabledLocationMenuCategory &&
      thunkAPI.dispatch(
        setdisabledLocationMenuCategory(disabledLocationMenuCategory)
      );
    onSuccess && onSuccess();
  }
);
export const deleteMenuCategory = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (payload: DeleteMenuCategoryPayload, thunkAPI) => {
    const { onSuccess, menuCategoryId } = payload;

    if (!menuCategoryId) {
      return alert("not the correct route");
    }

    await fetch(
      `${config.backofficeApiBaseUrl}/menu-category?id=${menuCategoryId}`,
      {
        method: "DELETE",
      }
    );

    thunkAPI.dispatch(removeMenuCategory(menuCategoryId));
    onSuccess && onSuccess();
  }
);

export const menuCategorySlice = createSlice({
  name: "menuCategory",
  initialState,
  reducers: {
    setMenuCategory: (state, action: PayloadAction<MenuCategory[]>) => {
      state.menuCategories = action.payload;
    },
    addMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.menuCategories = [...state.menuCategories, action.payload];
    },
    removeMenuCategory: (state, action: PayloadAction<number>) => {
      state.menuCategories = state.menuCategories.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
    replaceMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.menuCategories = state.menuCategories.map((item) => {
        return item.id === action.payload.id ? action.payload : item;
      });
    },
  },
});

export const {
  replaceMenuCategory,
  setMenuCategory,
  addMenuCategory,
  removeMenuCategory,
} = menuCategorySlice.actions;

export default menuCategorySlice.reducer;
