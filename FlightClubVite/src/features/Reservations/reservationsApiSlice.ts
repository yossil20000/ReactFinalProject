import "../../Types/date.extensions"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor";
import { getServerAddress } from "../../Enums/Routers";
import { URLS } from "../../Enums/Urls";
import { IReservationFilterDate } from "../../Interfaces/API/IFlightReservation";
import IReservation, { IReservationCreateApi, IReservationDelete, IReservationUpdate } from "../../Interfaces/API/IReservation";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import { customLogger } from "../../customLogging";


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
                    customLogger.info("FixReservationDaySavingTime/response", response);
                    customLogger.info("FixReservationDaySavingTime/clientOffset",new Date(),new Date().getTimezoneOffset() );
                    response.data = FixDaySavingTime(response.data)
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
const FixDaySavingTime = (reservations: IReservation[]) : IReservation[]=> {
    const fixedResrvations = reservations.map((item) => {
        item.date_from = new Date(item.date_from).getOffsetDate(item.timeOffset)
        item.date_to = new Date(item.date_to).getOffsetDate(item.timeOffset)
        return item
    })
    customLogger.log("FixDaySavingTime/fixedResrvations",reservations,fixedResrvations)
    return fixedResrvations

}
export const {useFetchAllReservationsQuery, useDeleteReservationMutation, useCreateReservationMutation, useUpdateReservationMutation} = reservationApiSlice;

