import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor";
import { getServerAddress } from "../../Enums/Routers";
import { URLS } from "../../Enums/Urls";
import IMembership, { IMembershipCombo } from "../../Interfaces/API/IMembership";
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase";


export const membershipApiSlice = createApi({
    reducerPath: "membershipApiSlice",
    baseQuery:fetchBaseQuery({
        baseUrl: getServerAddress(),
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).authSlice.access_token
            if (token) {
              headers.set('authorization', `Bearer ${token}`)
            }
            return headers
          },

    }),
    tagTypes:["Membership"],
    refetchOnFocus: true,
    endpoints(builder) {
        return{
            
            fetchAllMembership: builder.query<IResultBase<IMembership>, void>({
                query: () => ({
                    url: `/${URLS.MEMBERSHIP_DETAILES}`
                }),
                providesTags: ["Membership"]
            }),
            fetchMembershipCombo: builder.query<IResultBase<IMembershipCombo>,void>({
                query: () => ({
                    url: `/${URLS.MEMBERSHIP_COMBO}`,
                    method: "GET"
                }),
                providesTags: ["Membership"]

            }),
            deleteMembership: builder.mutation<IResultBaseSingle<IMembership>,IMembership>({
                query: (membershipDelete) => ({
                    url: `/${URLS.MEMBERSHIP_DELETE}`,
                    method: "DELETE",
                    body: membershipDelete

                }),
                invalidatesTags: ["Membership"]
            }),
            createMembership: builder.mutation<IResultBaseSingle<IMembership>,IMembership>({
                query: (membershipCreate) => ({
                    url: `/${URLS.MEMBERSHIP_CREATE}`,
                    method: "POST",
                    body: membershipCreate

                }),
                invalidatesTags: ["Membership"]
            }),
            updateMembership: builder.mutation<IResultBaseSingle<IMembership>,IMembership>({
                query: (membershipUpdate) => ({
                    url: `/${URLS.MEMBERSHIP_UPDATE}`,
                    method: "PUT",
                    body: membershipUpdate

                }),
                invalidatesTags: ["Membership"]
            })
            

        }
    }
    
});

export const {
    useFetchAllMembershipQuery,
    useDeleteMembershipMutation,
    useCreateMembershipMutation,
    useUpdateMembershipMutation,
    useFetchMembershipComboQuery
} = membershipApiSlice;

