import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { getServerAddress, URLS } from "../../Enums/Routers";
import { RootState } from "../../app/userStor";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import { INotification } from "../../Interfaces/API/INotification";
import { urPK } from "@mui/material/locale";

export const notifyApiSlice = createApi({
  reducerPath: "notifyApiSlice",
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
  tagTypes: ["Notify"],
  endpoints(builder) {
    return {
      fetchAllNotifies: builder.query<IResultBase<INotification>, string>({
        query: (member_id) => ({
          url: `/${URLS.NOTIFY}/${member_id}`,
          method: 'GET'
        }),
        providesTags: ["Notify"]
      }),
      searchNotifies: builder.mutation<IResultBase<INotification>,any>({
        query:(filter) => ({
          url: `/${URLS.NOTIFY_SEARCH}`,
          method: 'POST',
          body: filter
        })
      }),
      createNotify: builder.mutation<IResultBaseSingle<INotification>,INotification>({
        query:(notification) => ({
          url: `/${URLS.NOTIFY_CREATE}`,
          method: 'POST',
          body: notification
        }),
        invalidatesTags: ['Notify']
      }),
      updateNotify: builder.mutation<IResultBaseSingle<INotification>,INotification>({
        query:(notification) =>({
          url: `/${URLS.NOTIFY_UPDATE}`,
          method: 'PUT',
          body: notification
        }),
        invalidatesTags: ['Notify']
      })

    }
  }

})

export const {
  useFetchAllNotifiesQuery,
  useSearchNotifiesMutation,
  useCreateNotifyMutation,
  useUpdateNotifyMutation
} = notifyApiSlice