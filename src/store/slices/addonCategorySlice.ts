import { config } from "@/config";
import {
  CreateAddonCategoryPayload,
  DeleteAddonCategoryPayload,
  UpdateAddonCategoryPayload,
} from "@/types/addon-category";
import { AddonCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showSnackbar } from "./appSnackbarSlice";
import {
  addMenuAddonCategory,
  setMenuAddonCategory,
} from "./menuAddonCategorySlice";

interface AddonCategoryState {
  addonCategories: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}
const initialState: AddonCategoryState = {
  addonCategories: [],
  isLoading: false,
  error: null,
};

//CRUD --> Create
export const createAddonCategory = createAsyncThunk(
  "addonCategory/createAddonCategory",
  async (payload: CreateAddonCategoryPayload, thunkAPI) => {
    const { onSuccess, ...addonCategoryData } = payload;

    const { name, isRequired, menuIds } = addonCategoryData;
    const valid = name && isRequired !== undefined && menuIds.length > 0;

    if (!valid) {
      return alert("some fields are required!");
    }

    const response = await fetch(
      `${config.backofficeApiBaseUrl}/addon-category`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();

    const { addonCategory, menuAddonCategory } = responseData;

    thunkAPI.dispatch(addAddonCategory(addonCategory));
    thunkAPI.dispatch(addMenuAddonCategory(menuAddonCategory));

    onSuccess && onSuccess();
  }
);

//CRUD --> Update
export const updateAddonCategory = createAsyncThunk(
  "addonCategory/updateAddonCategory",
  async (payload: UpdateAddonCategoryPayload, thunkAPI) => {
    const { onSuccess, ...addonCategoryData } = payload;

    const { id, name, isRequired, menuIds } = addonCategoryData;

    const valid = id && name && isRequired !== undefined && menuIds.length > 0;
    if (!valid) {
      return thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "some fields are required." })
      );
    }

    const response = await fetch(
      `${config.backofficeApiBaseUrl}/addon-category`,
      {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(addonCategoryData),
      }
    );

    const responseData = await response.json();

    const { updateAddonCategory, menuAddonCategory } = responseData;
    thunkAPI.dispatch(replaceAddonCategory(updateAddonCategory));
    menuAddonCategory &&
      thunkAPI.dispatch(setMenuAddonCategory(menuAddonCategory));
    onSuccess && onSuccess();
  }
);

//CRUD --> Delete
export const deleteAddonCategory = createAsyncThunk(
  "addonCategory/deleteAddonCategory",
  async (payload: DeleteAddonCategoryPayload, thunkAPI) => {
    const { onSuccess, addonCategoryId } = payload;

    if (!addonCategoryId) {
      return thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "incorrect route." })
      );
    }

    await fetch(
      `${config.backofficeApiBaseUrl}/addon-category?id=${addonCategoryId}`,
      {
        method: "DELETE",
      }
    );
    thunkAPI.dispatch(removeAddonCategory(addonCategoryId));
    onSuccess && onSuccess();

    //return menu; -->extra reducer
  }
);

const addonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    setAddonCategory: (state, action: PayloadAction<AddonCategory[]>) => {
      state.addonCategories = action.payload;
    },
    addAddonCategory: (state, action: PayloadAction<AddonCategory>) => {
      state.addonCategories = [...state.addonCategories, action.payload];
    },
    removeAddonCategory: (state, action: PayloadAction<number>) => {
      state.addonCategories = state.addonCategories.filter(
        (item) => item.id !== action.payload
      );
    },
    replaceAddonCategory: (state, action: PayloadAction<AddonCategory>) => {
      state.addonCategories = state.addonCategories.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
  },
});

export const {
  setAddonCategory,
  addAddonCategory,
  removeAddonCategory,
  replaceAddonCategory,
} = addonCategorySlice.actions;
export default addonCategorySlice.reducer;
