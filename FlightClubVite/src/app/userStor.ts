import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {apiSlice}  from '../features/Users/userSlice'
import {authApiSlice} from "../features/Auth/authApiSlice"
import {reservationApiSlice} from "../features/Reservations/reservationsApiSlice"
import authSliceReducer from "../features/Auth/authSlice";

export const storeUser = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer,
        [authApiSlice.reducerPath] : authApiSlice.reducer,
        [reservationApiSlice.reducerPath] : reservationApiSlice.reducer,
        authSlice: authSliceReducer ,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware).concat(authApiSlice.middleware)
    }
});

export type AppDispatch = typeof storeUser.dispatch;
export type RootState = ReturnType<typeof storeUser.getState>