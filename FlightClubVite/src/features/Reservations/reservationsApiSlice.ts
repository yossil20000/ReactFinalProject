import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URLS } from "../../Enums/Routers";
import IReservation from "../../Interfaces/API/IReservation";
import IResultBase from "../../Interfaces/API/IResultBase";

export const reservationApiSlice = createApi({
    reducerPath: "reservationApiSlice",
    baseQuery:fetchBaseQuery({
        baseUrl: URLS.BACKEND_URL,
        prepareHeaders(headers){
            return headers;
        }
    }),
    endpoints(builder) {
        return{
            fetchAllReservations: builder.query<IResultBase<IReservation>, void>({
                query(){return `/${URLS.RESERVATION}`}
            }),
        }
    }
    
});

export const {useFetchAllReservationsQuery} = reservationApiSlice;

