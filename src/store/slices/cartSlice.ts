import { CartItem, CartState } from "@/types/cart";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
  isLoading: false,
  cartItems: [],
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const exist = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (exist) {
        state.cartItems = state.cartItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      } else {
        state.cartItems = [...state.cartItems, action.payload];
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
    },
    emptyCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
