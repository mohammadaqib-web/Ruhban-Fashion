import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (i) => i.productId === item.productId && i.sizeId === item.sizeId,
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
    },

    increaseQty: (state, action) => {
      const { productId, sizeId } = action.payload;

      const item = state.cartItems.find(
        (i) => i.productId === productId && i.sizeId === sizeId,
      );

      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const { productId, sizeId } = action.payload;

      const item = state.cartItems.find(
        (i) => i.productId === productId && i.sizeId === sizeId,
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      const { productId, sizeId } = action.payload;

      state.cartItems = state.cartItems.filter(
        (i) => !(i.productId === productId && i.sizeId === sizeId),
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
