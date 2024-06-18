import { configureStore } from "@reduxjs/toolkit";
import addonCategoryReducer from "./slices/addonCategorySlice";
import addonReducer from "./slices/addonSlice";
import appReducer from "./slices/appSlice";
import appSnackbarReducer from "./slices/appSnackbarSlice";
import cartReducer from "./slices/cartSlice";
import companyReducer from "./slices/companySlice";
import disabledLocationMenuCategoryReducer from "./slices/disabledLocationMenuCategorySlice";
import disabledLocationMenuReducer from "./slices/disabledLocationMenuSlice";
import locationReducer from "./slices/locationSlice";
import menuAddonCategoryReducer from "./slices/menuAddonCategorySlice";
import menuCategoryMenuReducer from "./slices/menuCategoryMenuSlice";
import menuCategoryReducer from "./slices/menuCategorySlice";
import menuReducer from "./slices/menuSlice";
import orderReducer from "./slices/orderSlice";
import tableReducer from "./slices/tableSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    company: companyReducer,
    menu: menuReducer,
    menuCategory: menuCategoryReducer,
    addon: addonReducer,
    addonCategory: addonCategoryReducer,
    table: tableReducer,
    location: locationReducer,
    menuCategoryMenu: menuCategoryMenuReducer,
    menuAddonCategory: menuAddonCategoryReducer,
    disabledLocationMenuCategory: disabledLocationMenuCategoryReducer,
    disabledLocationMenu: disabledLocationMenuReducer,
    appSnackbar: appSnackbarReducer,
    order: orderReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
