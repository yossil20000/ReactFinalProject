import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {apiSlice}  from '../features/Users/userSlice'

export const storeUser = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    }
});

export type AppDispatch = typeof storeUser.dispatch;
export type RootState = ReturnType<typeof storeUser.getState>