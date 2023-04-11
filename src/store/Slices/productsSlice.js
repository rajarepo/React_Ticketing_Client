import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  loading: false,
  paginationProps: {},
  running : false,
  result: null,
};
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProductsDispatch: (state, { payload }) => {
      state.products = payload;
    },
    getProductDispatch: (state, { payload }) => {
      state.product = payload;
    },
    setProductsLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setRunning: (state, { payload }) => {
      state.running = payload;
    },
    setResult: (state, { payload }) => {
      state.result = payload;
    },
    getProductsPaginationProps: (state, { payload }) => {
      state.paginationProps = payload;
    },
  },
});

const { reducer, actions } = productsSlice;
export const {
  getProductDispatch,
  getProductsDispatch,
  setProductsLoading,
  setRunning, 
  setResult,
  getProductsPaginationProps } = actions;

export default reducer;
