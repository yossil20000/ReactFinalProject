import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { URLS } from "../../Enums/Routers"
import IDevice from "../../Interfaces/API/IDevice"
import IResultBase from "../../Interfaces/API/IResultBase"

export const deviceApiSlice = createApi({
reducerPath: "deviceApiSlice",
baseQuery: fetchBaseQuery({
  baseUrl: URLS.BACKEND_URL,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token : string = (getState() as RootState).authSlice.access_token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
}),
tagTypes: ["Devices"],
endpoints(builder){
  return {
    fetchAllDevices: builder.query<IResultBase<IDevice>,void>({
      query: () => `/${URLS.DEVICES}`,
      providesTags: ["Devices"]
    })
  }
}

});

export const {
useFetchAllDevicesQuery
} = deviceApiSlice;