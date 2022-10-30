import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { URLS } from "../../Enums/Routers"
import IDevice from "../../Interfaces/API/IDevice"
import IDeviceType from "../../Interfaces/API/IDeviceType"
import IResultBase from "../../Interfaces/API/IResultBase"

export const deviceTypesApiSlice = createApi({
reducerPath: "deviceTypesApiSlice",
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
tagTypes: ["DeviceTypes"],
endpoints(builder){
  return {
    fetchAllDeviceTypes: builder.query<IResultBase<IDeviceType>,void>({
      query: () => `/${URLS.DEVICE_TYPES}`,
      providesTags: ["DeviceTypes"]
    })
  }
}

});

export const {
useFetchAllDeviceTypesQuery
} = deviceTypesApiSlice;