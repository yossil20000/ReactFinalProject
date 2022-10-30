import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {apiSlice}  from '../features/Users/userSlice'
import {authApiSlice} from "../features/Auth/authApiSlice"
import {reservationApiSlice} from "../features/Reservations/reservationsApiSlice"
import authSliceReducer from "../features/Auth/authSlice";
import { deviceApiSlice } from "../features/Device/deviceApiSlice";
import { flightApi } from "../features/Flight/flightApi";
import { noticeApiSlice } from "../features/clubNotice/noticeApiSlice";
import { deviceTypesApiSlice } from "../features/DeviceTypes/deviceTypesApiSlice";

export const storeUser = configureStore({
    reducer:{
        [apiSlice.reducerPath] : apiSlice.reducer,
        [authApiSlice.reducerPath] : authApiSlice.reducer,
        [reservationApiSlice.reducerPath] : reservationApiSlice.reducer,
        [deviceApiSlice.reducerPath] : deviceApiSlice.reducer,
        [flightApi.reducerPath] : flightApi.reducer,
        [noticeApiSlice.reducerPath] : noticeApiSlice.reducer,
        [deviceTypesApiSlice.reducerPath] : deviceTypesApiSlice.reducer,
        authSlice: authSliceReducer ,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware).concat(authApiSlice.middleware).concat(deviceApiSlice.middleware).concat(reservationApiSlice.middleware).concat(flightApi.middleware).concat(noticeApiSlice.middleware).concat(deviceTypesApiSlice.middleware)
    }
});

export type AppDispatch = typeof storeUser.dispatch;
export type RootState = ReturnType<typeof storeUser.getState>