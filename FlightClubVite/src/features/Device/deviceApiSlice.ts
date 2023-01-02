import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress, URLS } from "../../Enums/Routers"
import IDevice, { IDeviceCanReserve, IDeviceCombo, IDeviceComboFilter, IDeviceCreate } from "../../Interfaces/API/IDevice"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { IStatus } from "../../Interfaces/API/IStatus"

export const deviceApiSlice = createApi({
  reducerPath: "deviceApiSlice",
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
  tagTypes: ["Devices", "Device"],
  endpoints(builder) {
    return {
      fetchAllDevices: builder.query<IResultBase<IDevice>, void>({
        query: () => `/${URLS.DEVICES}`,
        providesTags: ["Devices"]
      }),
      fetchDevice: builder.query<IResultBase<IDevice>, string>({
        query: (_id) => ({
          url: `/${URLS.DEVICES}/${_id}`,
          method: "GET"
        }),
        providesTags: ["Device"],

      }),
      updateDevice: builder.mutation<IResultBaseSingle<IDevice>, IDevice>({
        query: (device) => ({
          url: `/${URLS.DEVICE_UPDATE}`,
          method: 'PUT',
          body: device
        }),
        invalidatesTags: [{ type: "Devices" }]
      }),
      deleteDevice: builder.mutation<IResultBaseSingle<IDevice>, string>({
        query: (_id) => ({
          url: `/${URLS.DEVICE_DELETE}/${_id}`,
          method: "DELETE"
        }),
        invalidatesTags: [{ type: "Devices" }]
      }),
      createDevice: builder.mutation<IResultBaseSingle<IDevice>, IDeviceCreate>({
        query: (device) => ({
          url: `/${URLS.DEVICE_CREATE}`,
          method: 'POST',
          body: device
        }),
        invalidatesTags: [{ type: "Devices" }]
      }),
      fetchDevicsCombo: builder.query<IResultBase<IDeviceCombo>, IDeviceComboFilter>({
        query: (filter) => ({
          url: `/${URLS.DEVICES_COMBO}`,
          body: filter,
          method: "POST"
        })
      }),
      fetchDevicCanReserv: builder.query<IResultBase<IDeviceCanReserve>, string>({
        query: (_id) => ({
          url: `/${URLS.DEVICES_CAN_RESERV}/${_id}`,
          method: "GET"
        })
      }),
      updateStatusDevice: builder.mutation<IResultBaseSingle<IDevice>, IStatus>({
        query: (status) => ({
          url: `/${URLS.DEVICE_STATUS}`,
          method: "PUT",
          body: status,

        }),
        invalidatesTags: [{ type: "Devices" }]
      }),
    }
  }

});

export const {
  useFetchAllDevicesQuery,
  useUpdateDeviceMutation,
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useFetchDeviceQuery,
  useFetchDevicsComboQuery,
  useUpdateStatusDeviceMutation,
  useFetchDevicCanReservQuery
} = deviceApiSlice;