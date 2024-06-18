import { config } from "@/config";
import {
  AppState,
  GetAppDataOptions,
  Theme,
  UploadAssetPayload,
} from "@/types/app";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { setAddonCategory } from "./addonCategorySlice";
import { setAddon } from "./addonSlice";
import { setCompany } from "./companySlice";
import { setdisabledLocationMenuCategory } from "./disabledLocationMenuCategorySlice";
import { setdisabledLocationMenu } from "./disabledLocationMenuSlice";
import { setLocation } from "./locationSlice";
import { setMenuAddonCategory } from "./menuAddonCategorySlice";
import { setMenuCategoryMenu } from "./menuCategoryMenuSlice";
import { setMenuCategory } from "./menuCategorySlice";
import { setMenu } from "./menuSlice";
import { setOrders } from "./orderSlice";
import { setTable } from "./tableSlice";

const initialState: AppState = {
  init: false,
  selectedLocation: null,
  theme: "light",
  isLoading: false,
  error: null,
};

export const uploadAsset = createAsyncThunk(
  "app/uploadAsset",
  async (payload: UploadAssetPayload) => {
    const { file, onSuccess } = payload;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${config.backofficeApiBaseUrl}/asset`, {
      method: "POST",
      body: formData,
    });

    const dataFromServer = await response.json();
    const { assetUrl } = dataFromServer;

    onSuccess && onSuccess(assetUrl);
  }
);

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (option: GetAppDataOptions, thunkApi) => {
    thunkApi.dispatch(setIsLoading(true));
    try {
      const { tableId, orderSeq } = option;

      const apiUrl = tableId
        ? `${config.orderApiBaseUrl}/app?tableId=${tableId}&&orderSeq=${orderSeq}`
        : `${config.backofficeApiBaseUrl}/app`;

      const response = await fetch(apiUrl);
      const responseData = await response.json();

      const {
        company,
        locations,
        tables,
        menuCategories,
        menus,
        addonCategories,
        addons,
        orders,
        menuCategoryMenu,
        menuAddonCategory,
        disabledLocationMenuCategory,
        disabledLocationMenu,
      } = responseData;

      thunkApi.dispatch(setCompany(company));
      thunkApi.dispatch(setLocation(locations));
      thunkApi.dispatch(setTable(tables));
      thunkApi.dispatch(setMenu(menus));
      thunkApi.dispatch(setMenuCategory(menuCategories));
      thunkApi.dispatch(setAddonCategory(addonCategories));
      thunkApi.dispatch(setAddon(addons));
      thunkApi.dispatch(setOrders(orders));
      thunkApi.dispatch(setMenuCategoryMenu(menuCategoryMenu));
      thunkApi.dispatch(setMenuAddonCategory(menuAddonCategory));
      thunkApi.dispatch(
        setdisabledLocationMenuCategory(disabledLocationMenuCategory)
      );
      thunkApi.dispatch(setdisabledLocationMenu(disabledLocationMenu));
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        const ownLocation = locations.find(
          (item: any) => item.id === Number(selectedLocationId)
        ) as Location;
        if (!ownLocation) {
          localStorage.removeItem("selectedLocationId");
          localStorage.setItem("selectedLocationId", String(locations[0].id));
          thunkApi.dispatch(setSelectedLocation(locations[0]));
          return;
        } else {
          thunkApi.dispatch(setSelectedLocation(ownLocation));
        }
      } else {
        thunkApi.dispatch(setSelectedLocation(locations[0]));
        localStorage.setItem("selectedLocationId", locations[0].id);
      }
      thunkApi.dispatch(
        setTheme((localStorage.getItem("theme") as Theme) ?? "light")
      );
      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setIsLoading(false));
    } catch (err) {
      console.log("error :", err);
    }
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const appDataSelector = (state: RootState) => {
  return {
    company: state.company.company,
    locations: state.location.locations,
    tables: state.table.tables,
    menus: state.menu.menus,
    menuCategories: state.menuCategory.menuCategories,
    addons: state.addon.addons,
    addonCategories: state.addonCategory.addonCategories,
    menuAddonCategory: state.menuAddonCategory.menuAddonCategory,
    menuCategoryMenu: state.menuCategoryMenu.menuCategoryMenu,
    disabledLocationMenu: state.disabledLocationMenu.disabledLocationMenu,
    disabledLocationMenuCategories:
      state.disabledLocationMenuCategory.disabledLocationMenuCategories,
    orders: state.order.orders,
    app: state.app,
  };
};

export const { setInit, setSelectedLocation, setIsLoading, setTheme } =
  appSlice.actions;

export default appSlice.reducer;
