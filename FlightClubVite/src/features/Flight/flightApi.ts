import "../../Types/date.extensions"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/userStor";
import { getServerAddress } from "../../Enums/Routers";
import { URLS } from "../../Enums/Urls";
import IFlight, {  IFlightCreateApi, IFlightDeleteApi, IFlightFilterDate, IFlightUpdateApi } from "../../Interfaces/API/IFlight";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import { IParams, getUrlWithParams, getUrlWithParamsArray } from "../../Utils/url";

export const flightApi = createApi({
  reducerPath: "flightApi",
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
  tagTypes: ['Flights'],
  endpoints(builder) {
    return {
      getAllFlights: builder.query<IResultBase<IFlight>,IFlightFilterDate>({
        query: (filter) => ({
          url:`/${URLS.FLIGHT_SEARCH}/date?from=${filter.from}&to=${filter.to}`,
          method: "GET"
        }),providesTags: ["Flights"],
        transformResponse: (response : IResultBase<IFlight>) => {
          CustomLogger.info("FixDaySavingTime/response", response);
          CustomLogger.info("FixDaySavingTime/clientOffset",new Date(),new Date().getTimezoneOffset() );
          response.data =  FixDaySavingTime(response.data)
          return response;
        }
      }),
      getAllFlightsSearch: builder.query<IResultBase<IFlight>,{[key: string]: string} | any>({
        query: (filter) => ({
          url:getUrlWithParams(`/${URLS.FLIGHT_SEARCH}/filter`,filter) ,
          method: "GET"
        }),providesTags: ["Flights"],
        transformResponse: (response : IResultBase<IFlight>) => {
          CustomLogger.info("FixDaySavingTime/response", response);
          CustomLogger.info("FixDaySavingTime/clientOffset",new Date(),new Date().getTimezoneOffset() );
          response.data =  FixDaySavingTime(response.data)
          return response;
        }
      }),
      getAllFlightsParams: builder.query<IResultBase<IFlight>,IParams[]>({
        query: (filter) => ({
          url:getUrlWithParamsArray(`/${URLS.FLIGHT_SEARCH}/filter`,filter) ,
          method: "GET"
        }),providesTags: ["Flights"],
        transformResponse: (response : IResultBase<IFlight>) => {
          CustomLogger.info("FixDaySavingTime/response", response);
          CustomLogger.info("FixDaySavingTime/clientOffset",new Date(),new Date().getTimezoneOffset() );
          response.data =  FixDaySavingTime(response.data)
          return response;
        }
      }),
      createFlight: builder.mutation<IFlight,IFlightCreateApi>({
        query: (flight) =>( {   
            url: `/${URLS.FLIGHT}/create`,
            method: 'POST',
            body: flight          
        }),
        invalidatesTags:[{type: 'Flights'}],
        transformResponse: (results:{data: {flight: IFlight}}) =>
        results.data.flight,
  
      }),
      updateFlight: builder.mutation<IFlight,IFlightUpdateApi>({
        query: (flight) =>( {
            url: `/${URLS.FLIGHT}/update`,
            method: 'PUT',
            body: flight         
        }),
        invalidatesTags:[{type: 'Flights'}],
        transformResponse: (results:{data: {flight: IFlight}}) =>
        results.data.flight,
  
      }),
      deleteFlight: builder.mutation<IResultBaseSingle<IFlight>, IFlightDeleteApi>({
        query: (flight) => ({
          url:`/${URLS.FLIGHT}/delete`,
          method: 'DELETE',
          body: flight
        }),
        invalidatesTags:[{type: 'Flights'}],
      })
    }
    
  }
});
const FixDaySavingTime = (flights: IFlight[]) : IFlight[]=> {
  CustomLogger.info("FixDaySavingTime/fixedflights/flights",flights)
  const fixedflights = flights.map((item) => {
      item.date = new Date(item.date).getOffsetDate(item.timeOffset)
      CustomLogger.info("FixDaySavingTime/fixedflights/dateFixed",item)
      return item
  })
  CustomLogger.info("FixDaySavingTime/fixedflights/flights,fixedflights",flights,fixedflights)
  return flights

}
export const {
useCreateFlightMutation,
useGetAllFlightsQuery,
useDeleteFlightMutation,
useUpdateFlightMutation,
useGetAllFlightsSearchQuery,
useGetAllFlightsParamsQuery
} = flightApi;