import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {apiSlice}  from '../features/Users/userSlice'
import {apiAuthSlice} from "../features/Auth/authSlice"

export const storeUser = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer,
        [apiAuthSlice.reducerPath] : apiAuthSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware).concat(apiAuthSlice.middleware)
    }
});

export type AppDispatch = typeof storeUser.dispatch;
export type RootState = ReturnType<typeof storeUser.getState>