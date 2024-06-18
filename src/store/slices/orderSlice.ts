import { config } from "@/config";
import {
  CreateOrderOptions,
  OrderState,
  RefreshOrderOptions,
  UpdateOrderOptions,
} from "@/types/order";
import { Order } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showSnackbar } from "./appSnackbarSlice";
import { emptyCart } from "./cartSlice";

const initialState: OrderState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (option: CreateOrderOptions, thunkApi) => {
    const { tableId, cartItems, onSuccess } = option;

    const valid = tableId && cartItems.length > 0;
    if (!valid) return alert("some data required.");

    const response = await fetch(`${config.orderApiBaseUrl}/order`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({ tableId, cartItems }),
    });
    const { orders } = await response.json();
    thunkApi.dispatch(emptyCart());
    thunkApi.dispatch(setOrders(orders));
    onSuccess && onSuccess(orders);
  }
);
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (options: UpdateOrderOptions, thunkApi) => {
    const { itemId, status, onSuccess, onError } = options;
    try {
      thunkApi.dispatch(setIsLoading(true));
      const response = await fetch(
        `${config.backofficeApiBaseUrl}/order?itemId=${itemId}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const { orders } = await response.json();
      thunkApi.dispatch(setOrders(orders));
      thunkApi.dispatch(setIsLoading(false));
      onSuccess && onSuccess(orders);
    } catch (err) {
      onError && onError();
    }
  }
);

export const refreshOrder = createAsyncThunk(
  "order/refreshOrder",
  async (option: RefreshOrderOptions, thunkAPI) => {
    const { orderSeq, onError, onSuccess } = option;
    try {
      const valid = orderSeq;
      if (!valid) return alert("field not complete");
      thunkAPI.dispatch(setIsLoading(true));
      const response = await fetch(
        `${config.orderApiBaseUrl}/order?orderSeq=${orderSeq}`
      );

      const { orders } = await response.json();
      thunkAPI.dispatch(setOrders(orders));
      thunkAPI.dispatch(setIsLoading(false));
      onSuccess && onSuccess();
    } catch (err) {
      onError &&
        onError((err: Error | null) =>
          thunkAPI.dispatch(
            showSnackbar({ type: "error", message: `message :${err.message}` })
          )
        );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders, setIsLoading } = orderSlice.actions;
export default orderSlice.reducer;
