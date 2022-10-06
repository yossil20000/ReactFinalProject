import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/userStor";
import { URLS } from "../../Enums/Routers";
import IFlight, { IFlightCreateApi, IFlightDeleteApi, IFlightUpdateApi } from "../../Interfaces/API/IFlight";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
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
            
            body: flight
          
        }),
        invalidatesTags:[{type: 'Flights', id: 'LIST'}],
        transformResponse: (results:{data: {flight: IFlight}}) =>
        results.data.flight,
  
      }),
      updateFlight: builder.mutation<IFlight,IFlightUpdateApi>({
        query: (flight) =>( {
          
            url: `/${URLS.FLIGHT}/update`,
            method: 'PUT',
            
            body: flight
          
        }),
        invalidatesTags:[{type: 'Flights', id: 'LIST'}],
        transformResponse: (results:{data: {flight: IFlight}}) =>
        results.data.flight,
  
      }),
      deleteFlight: builder.mutation<IResultBaseSingle<IFlight>, IFlightDeleteApi>({
        query: (flight) => ({
          url:`/${URLS.FLIGHT}/delete`,
          method: 'DELETE',
          body: flight
        }),
        invalidatesTags:[{type: 'Flights', id: 'LIST'}],
      })
    }
    
  }
});

export const {
useCreateFlightMutation,
useGetAllFlightsQuery,
useDeleteFlightMutation,
useUpdateFlightMutation
} = flightApi;