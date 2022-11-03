import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { URLS } from "../../Enums/Routers"
import IDevice from "../../Interfaces/API/IDevice"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"

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
tagTypes: ["Devices","Device"],
endpoints(builder){
  return {
    fetchAllDevices: builder.query<IResultBase<IDevice>,void>({
      query: () => `/${URLS.DEVICES}`,
      providesTags: ["Devices"]
    }),
    fetchDevice: builder.query<IResultBase<IDevice>,string>({
      query: (_id) => ({
        url: `/${URLS.DEVICES}/${_id}`,
        method: "GET"
      }),  
      providesTags: ["Device"],
      
    }),
    updateDevice : builder.mutation<IResultBaseSingle<IDevice>,IDevice>({
      query:(device) =>({
        url: `/${URLS.DEVICE_UPDATE}`,
        method: 'PUT',
        body: device
      }),
      invalidatesTags: [{type: "Devices"}]
    }),
    deleteDevice : builder.mutation<IResultBaseSingle<IDevice>,IDevice>({
      query:(device) => ({
        url:`/${URLS.DEVICE_DELETE}`,
        method: "DELETE",
        body: device
      }),
      invalidatesTags: [{type: "Devices"}]
    }),
    createDevice : builder.mutation<IResultBaseSingle<IDevice>,IDevice>({
      query:(device) =>({
        url: `/${URLS.DEVICE_CREATE}`,
        method: 'POST',
        body: device
      }),
      invalidatesTags: [{type: "Devices"}]
    })
  }
}

});

export const {
useFetchAllDevicesQuery,
useUpdateDeviceMutation,
useCreateDeviceMutation,
useDeleteDeviceMutation,
useFetchDeviceQuery
} = deviceApiSlice;