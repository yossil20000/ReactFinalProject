import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { URLS,getServerAddress } from "../../Enums/Routers"
import IDevice from "../../Interfaces/API/IDevice"
import IDeviceType from "../../Interfaces/API/IDeviceType"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { IStatus } from "../../Interfaces/API/IStatus"

export const deviceTypesApiSlice = createApi({
  reducerPath: "deviceTypesApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: getServerAddress(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token: string = (getState() as RootState).authSlice.access_token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["DeviceTypes"],
  endpoints(builder) {
    return {
      fetchAllDeviceTypes: builder.query<IResultBase<IDeviceType>, void>({
        query: () => `/${URLS.DEVICE_TYPES}`,
        providesTags: ["DeviceTypes"]
      }),
      updateStatusDeviceType: builder.mutation<IResultBaseSingle<IDeviceType>, IStatus>({
        query: (status) => ({
          url: `/${URLS.DEVICE_TYPES_STATUS}`,
          method: "PUT",
          body: status,

        }),
        invalidatesTags: [{type: "DeviceTypes"}]
      }),
      updateDeviceType: builder.mutation<IResultBaseSingle<IDeviceType>, IDeviceType>({
        query: (deviceType) => ({
          url: `/${URLS.DEVICE_TYPES_UPDATE}`,
          method: "PUT",
          body: deviceType,

        }),
        invalidatesTags: [{type: "DeviceTypes"}]
      }),
      createDeviceType: builder.mutation<any, IDeviceType>({
        query: (deviceType) => ({
          url: `/${URLS.DEVICE_TYPES_CREATE}`,
          method: "POST",
          body: deviceType,

        }),
        invalidatesTags: [{type: "DeviceTypes"}]
      }),
    }
  }
});

export const {
  useFetchAllDeviceTypesQuery,
  useUpdateStatusDeviceTypeMutation,
  useUpdateDeviceTypeMutation,
  useCreateDeviceTypeMutation
} = deviceTypesApiSlice;