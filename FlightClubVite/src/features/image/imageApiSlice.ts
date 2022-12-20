import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { getServerAddress, URLS } from "../../Enums/Routers";
import { RootState } from "../../app/userStor";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import IImage from "../../Interfaces/API/IImage";

export const imageApiSlice = createApi({
  reducerPath: "imageApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: getServerAddress(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token : string = (getState() as RootState).authSlice.access_token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Images"],
  endpoints(builder){
    return {
      fetchAllImages: builder.query<IResultBase<IImage>,void>({
        query: () => ({
          url: `/${URLS.IMAGE}`,
          method: 'GET'
        }),
        providesTags: ["Images"]
      }),
      fetchImage: builder.query<IResultBaseSingle<IImage>,string>({
        query: (_id) => ({
          url: `/${URLS.IMAGE}/${_id}`,
          method: 'GET'
        })
      }),
      deleteImage: builder.mutation<IResultBaseSingle<IImage>,string>({
        query: (_id) => ({
          url: `/${URLS.IMAGE_DELETE}`,
          body: {_id: _id},
          method: 'DELETE'
        }),
        invalidatesTags: ["Images"]
      }),
      createImage: builder.mutation<IResultBaseSingle<IImage>,IImage>({
        query: (message) => ({
          url: `/${URLS.IMAGE_CREATE}`,
          method: 'DELETE',
          body:message
        }),
        invalidatesTags: ["Images"]
      }),
      updateImage: builder.mutation<IResultBaseSingle<IImage>,IImage>({
        query: (message) => ({
          url: `/${URLS.IMAGE_UPDATE}`,
          method: 'UPDATE',
          body:message
        }),
        invalidatesTags: ["Images"]
      })
    }
  }
})

export const {
  useFetchAllImagesQuery,
  useFetchImageQuery,
  useDeleteImageMutation,
  useCreateImageMutation,
  useUpdateImageMutation
} = imageApiSlice;