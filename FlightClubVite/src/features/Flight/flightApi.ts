import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/userStor";
import { URLS } from "../../Enums/Routers";
import IFlight, { IFlightCreateApi } from "../../Interfaces/API/IFlight";
import IResultBase from "../../Interfaces/API/IResultBase";
import customFetchBase from "../customeFetchBase";

export const flightApi = createApi({
  reducerPath: "flightApi",
  baseQuery:fetchBaseQuery({
    baseUrl: URLS.BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).authSlice.access_token
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
        return headers
      },

}),
  tagTypes: ['Flights'],
  endpoints(builder) {
    return {
      getAllFlights: builder.query<IResultBase<IFlight>,void>({
        query: () => ({
          url:`/${URLS.FLIGHT}/`,
          method: "GET"
        }),
      }),
      createFlight: builder.mutation<IFlight,IFlightCreateApi>({
        query: (flight) =>( {
          
            url: `/${URLS.FLIGHT}/create`,
            method: 'POST',
            credentials: 'include',
            body: flight
          
        }),
        invalidatesTags:[{type: 'Flights', id: 'LIST'}],
        transformResponse: (results:{data: {flight: IFlight}}) =>
        results.data.flight,
  
      }),
    }
    
  }
});

export const {
useCreateFlightMutation,
useGetAllFlightsQuery
} = flightApi;