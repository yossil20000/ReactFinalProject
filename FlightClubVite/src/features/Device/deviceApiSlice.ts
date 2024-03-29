import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress } from "../../Enums/Routers"
import { URLS } from "../../Enums/Urls"
import IDevice, { IDeviceCanReserve, IDeviceCombo, IDeviceComboFilter, IDeviceCreate, IDeviceReport } from "../../Interfaces/API/IDevice"
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
      fetchDevice: builder.query<IResultBaseSingle<IDevice>, string>({
        query: (_id) => ({
          url: `/${URLS.DEVICES_DEVICE}/${_id}`,
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
        invalidatesTags: ["Devices"]
      }),
      updateOneDevice: builder.mutation<IResultBaseSingle<IDevice>, {_id: string,update: {}}>({
        query: (device) => ({
          url: `/${URLS.DEVICE_UPDATE_ONE}`,
          method: 'PUT',
          body: device
        }),
        invalidatesTags: ["Devices"]
      }),
      deleteDevice: builder.mutation<IResultBaseSingle<IDevice>, string>({
        query: (_id) => ({
          url: `/${URLS.DEVICE_DELETE}/${_id}`,
          method: "DELETE"
        }),
        invalidatesTags: ["Devices"]
      }),
      createDevice: builder.mutation<IResultBaseSingle<IDevice>, IDeviceCreate>({
        query: (device) => ({
          url: `/${URLS.DEVICE_CREATE}`,
          method: 'POST',
          body: device
        }),
        invalidatesTags: ["Devices"]
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
        invalidatesTags: ["Devices"]
      }),
      fetchDeviceReport: builder.query<IResultBase<IDeviceReport>,string>({
        query: (device_id) => ({
          url: `/${URLS.DEVICE_REPORT}/${device_id}`,
          method: 'GET'
        })
      })
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
  useFetchDevicCanReservQuery,
  useUpdateOneDeviceMutation,
  useFetchDeviceReportQuery
} = deviceApiSlice;