import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../../app/userStor";
import { URLS } from "../../Enums/Routers";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import IClubNotice from '../../Interfaces/API/IClubNotice'



export const noticeApiSlice = createApi({
  reducerPath: "noticeApiSlice",
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
  tagTypes: ["ClubNotice"],
  endpoints(builder){
    return{
      fetchAllNotices: builder.query<IResultBase<IClubNotice>,void>({
        query: () => ({
          url: `/${URLS.CLUB_NOTICE}`,
          method: "GET"
        }),
      }),
      fetchNotice: builder.query<IResultBaseSingle<IClubNotice>,string>({
        query: (_id) => ({
          url:  `/${URLS.CLUB_NOTICE}/${_id}`,
          method: "GET"
         }) ,
      }),
      deleteNotice: builder.mutation<IResultBaseSingle<IClubNotice>,string>({
        query: (_id) => ({
          url: `/${URLS.CLUB_NOTICE_DELETE}`,
          body: {_id: _id},
          method: "DELETE"
        }),
        invalidatesTags: ["ClubNotice"]
      }),


    }
  }
})

export const {
  
  useDeleteNoticeMutation,
  useFetchAllNoticesQuery,
  useFetchNoticeQuery
} = noticeApiSlice