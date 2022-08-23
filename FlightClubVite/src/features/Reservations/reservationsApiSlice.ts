import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URLS } from "../../Enums/Routers";
import IReservation, { IReservationCreate, IReservationDelete, IReservationUpdate } from "../../Interfaces/API/IReservation";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";


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
            deleteReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationDelete>({
                query: (reservationDelete) => ({
                    url: `/${URLS.RESERVATION_DELETE}`,
                    method: "DELETE",
                    body: reservationDelete

                })
            }),
            createReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationCreate>({
                query: (reservationCreate) => ({
                    url: `/${URLS.RESERVATION_CREATE}`,
                    method: "POST",
                    body: reservationCreate

                })
            }),
            updateReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationUpdate>({
                query: (RESERVATION_UPDATE) => ({
                    url: `/${URLS.RESERVATION}`,
                    method: "PUT",
                    body: RESERVATION_UPDATE

                })
            })
            

        }
    }
    
});

export const {useFetchAllReservationsQuery, useDeleteReservationMutation, useCreateReservationMutation, useUpdateReservationMutation} = reservationApiSlice;

