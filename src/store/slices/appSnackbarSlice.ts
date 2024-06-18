import { AppSnackbarState, SnackbarType } from "@/types/appSnackbar";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: AppSnackbarState = {
  type: "success",
  open: false,
  message: "",
};

export const appSnackbarSlice = createSlice({
  name: "appSnackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ type: SnackbarType; message: string }>
    ) => {
      const { type, message } = action.payload;
      state.type = type;
      state.message = message;
      state.open = true;
    },
    hideSnackbar: (state) => {
      state.type = "success";
      state.open = false;
      state.message = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = appSnackbarSlice.actions;
export default appSnackbarSlice.reducer;
