import { config } from "@/config";
import {
  CreateAddonPayload,
  DeleteAddonPayload,
  UpdateAddonPayload,
} from "@/types/addon";
import { Addon } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showSnackbar } from "./appSnackbarSlice";

interface AddonState {
  addons: Addon[];
  isLoading: boolean;
  error: Error | null;
}

const initialState: AddonState = {
  addons: [],
  isLoading: false,
  error: null,
};

export const createNewAddon = createAsyncThunk(
  "addon/createAddon",
  async (paylaod: CreateAddonPayload, thunkAPI) => {
    //validation
    const { onSuccess, onError, ...addonData } = paylaod;
    const { name, price, addonCategoryId } = addonData;

    const valid = name && price !== undefined && addonCategoryId !== undefined;
    if (!valid) {
      thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "some fields are required." })
      );
    }
    //fetch to server
    const response = await fetch(`${config.backofficeApiBaseUrl}/addon`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(addonData),
    });
    //dispatch to store
    const { addon } = await response.json();

    thunkAPI.dispatch(addAddon(addon));

    onSuccess && onSuccess();
  }
);
export const updateAddon = createAsyncThunk(
  "addon/updateAddon",
  async (paylaod: UpdateAddonPayload, thunkAPI) => {
    //validation
    const { onSuccess, ...addonData } = paylaod;
    const { id, name, price, addonCategoryId } = addonData;

    const valid =
      id && name && price !== undefined && addonCategoryId !== undefined;
    if (!valid) {
      thunkAPI.dispatch(
        showSnackbar({ type: "error", message: "some fields are required." })
      );
    }
    //fetch to server
    const response = await fetch(`${config.backofficeApiBaseUrl}/addon`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(addonData),
    });
    //dispatch to store
    const { addon } = await response.json();

    thunkAPI.dispatch(replaceAddon(addon));

    onSuccess && onSuccess();
  }
);

export const deleteAddon = createAsyncThunk(
  "addon/deleteAddon",
  async (payload: DeleteAddonPayload, thunkAPI) => {
    const { onSuccess, addonId } = payload;

    if (!addonId) {
      return alert("incorrect route.");
    }

    await fetch(`${config.backofficeApiBaseUrl}/addon?id=${addonId}`, {
      method: "DELETE",
    });
    thunkAPI.dispatch(removeAddon(addonId));
    onSuccess && onSuccess();

    //return menu; -->extra reducer
  }
);

const addonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    setAddon: (state, action: PayloadAction<Addon[]>) => {
      state.addons = action.payload;
    },
    addAddon: (state, action: PayloadAction<Addon>) => {
      state.addons = [...state.addons, action.payload];
    },
    replaceAddon: (state, action: PayloadAction<Addon>) => {
      state.addons = state.addons.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddon: (state, action: PayloadAction<number>) => {
      state.addons = state.addons.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setAddon, addAddon, removeAddon, replaceAddon } =
  addonSlice.actions;
export default addonSlice.reducer;
