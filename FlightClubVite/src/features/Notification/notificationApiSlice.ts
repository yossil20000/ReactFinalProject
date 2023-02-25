import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { getServerAddress, URLS } from "../../Enums/Routers";
import { RootState } from "../../app/userStor";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";

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
      fetchAllNotifies: builder.query<IResultBase<void>, void>({
        query: () => ({
          url: ``,
          method: 'GET'
        }),
        providesTags: ["Notify"]
      }),
      
    }
  }

})

export const {
  useFetchAllNotifiesQuery
} = notifyApiSlice