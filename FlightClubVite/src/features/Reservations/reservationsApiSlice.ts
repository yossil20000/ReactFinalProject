import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor";
import { getServerAddress, URLS } from "../../Enums/Routers";
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation";
import IReservation, { IReservationCreateApi, IReservationDelete, IReservationUpdate } from "../../Interfaces/API/IReservation";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";


export const reservationApiSlice = createApi({
    reducerPath: "reservationApiSlice",
    baseQuery:fetchBaseQuery({
        baseUrl: getServerAddress(),
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).authSlice.access_token
            if (token) {
              headers.set('authorization', `Bearer ${token}`)
            }
            return headers
          },

    }),
    tagTypes:["Reservation"],
    refetchOnFocus: true,
    endpoints(builder) {
        return{
            
            fetchAllReservations: builder.query<IResultBase<IReservation>, IReservationFilterDate>({
                query: (filter) => ({
                    url: `/${URLS.RESERVATION_SEARCH}?from=${filter.from}&to=${filter.to}`
                }),
                providesTags: ["Reservation"],
                transformResponse: (response : IResultBase<IReservation>) => {
                    console.log("fetchAllReservations/response", response);
                    console.log("fetchAllReservations/clientOffset",new Date().getTimezoneOffset() );
                    return response;
                  }
            }),
            deleteReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationDelete>({
                query: (reservationDelete) => ({
                    url: `/${URLS.RESERVATION_DELETE}`,
                    method: "DELETE",
                    body: reservationDelete

                }),
                invalidatesTags: ["Reservation"]
            }),
            createReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationCreateApi>({
                query: (reservationCreate) => ({
                    url: `/${URLS.RESERVATION_CREATE}`,
                    method: "POST",
                    body: reservationCreate

                }),
                invalidatesTags: ["Reservation"]
            }),
            updateReservation: builder.mutation<IResultBaseSingle<IReservation>,IReservationUpdate>({
                query: (reservationUpdate) => ({
                    url: `/${URLS.RESERVATION_UPDATE}`,
                    method: "PUT",
                    body: reservationUpdate

                }),
                invalidatesTags: ["Reservation"]
            })
            

        }
    }
    
});

export const {useFetchAllReservationsQuery, useDeleteReservationMutation, useCreateReservationMutation, useUpdateReservationMutation} = reservationApiSlice;

