import { configureStore } from "@reduxjs/toolkit";
import { apiSlice1 } from "./api/apiSlice1";
import {authSlice1} from "../features/Auth/authSlice1"

export  const store1 = configureStore({
    reducer:{
        [apiSlice1.reducerPath] : apiSlice1.reducer,
       auth:authSlice1.reducer
    },
    middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(apiSlice1.middleware),
    devTools: true
})
export type AppDispatch = typeof store1.dispatch;
export type RootState = ReturnType<typeof store1.getState>