import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import IResultBase, { IResultBaseSingle } from '../../Interfaces/API/IResultBase'
import { getServerAddress } from '../../Enums/Routers';
import { URLS } from '../../Enums/Urls';
import IClubNotice from "../../Interfaces/API/IClubNotice";
import IMemberInfo from "../../Interfaces/IMemberInfo";
import { RootState } from "../../app/userStor";
import IMemberUpdate from "../../Interfaces/IMemberInfo";
import IMemberCreate from "../../Interfaces/IMemberCreate";
import { Gender, ILastId, IMemberAdmin, IMemberCombo, IMemberComboFilter, IMemberFlightSummary, IMemberStatus, Status } from "../../Interfaces/API/IMember";
import { IFlightSummaryFilter } from "../../Interfaces/API/IFilter";


interface Role {
    "user": string;
    "account": string;
}
export interface Member {
    "status": Status,
    "contact": {
        "billing_address": {
            "line1": string;
            "line2": string;
            "city": string;
            "postcode": string;
            "province": string;
            "state": string;
        },
        "shipping_address": {
            "line1": string;
            "line2": string;
            "city": string;
            "postcode": string;
            "province": string;
            "state": string;
        },
        "phone": {
            "country": string;
            "area": string;
            "number": string;
        },
        "email": string;
    },
    "_id": string;
    "member_id": string;
    "family_name": string;
    "first_name": string;
    "password": string;
    "member_type": string;
    "role": {
        "roles": Role[];
    },
    "date_of_birth": Date;
    "date_of_join": Date;
    "flights": [object];
    "flight_reservs": [object];
    "membership": object;
    image: string;
    gender: Gender;
}
export interface LogingProp {
    "password": string;
    "email": string;
}


export const apiSlice = createApi({
    reducerPath: 'apiSlice',
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
    tagTypes:["Members","Message"],
    endpoints(builder) {
        return {
            fetchAllClubNotice: builder.query<IResultBase<IClubNotice>, number | void>({
                query(limit = 10) { return `/${URLS.CLUB_NOTICE}`; }
            }),
            fetcAllMembers: builder.query<IResultBase<Member>, void>({
                query : () =>  `/${URLS.MEMBERS}` ,
                providesTags: ["Members"]
            }),
            getMemberById: builder.query<IResultBaseSingle<IMemberInfo>,string | "">({
                query: (id) => ({
                     url:  `/${URLS.MEMBER_DETAIL}/${id}`,
                     method: "GET"
                    }),
                providesTags: ["Members"]
            }),
            deleteMember: builder.mutation<IResultBaseSingle<IMemberInfo>,string>({
                query: (_id) => ({
                    url: `/${URLS.MEMBERS}/${_id}`,
                    method: "DELETE",

                }),
                invalidatesTags: ["Members"]
            }),
            createMember: builder.mutation<IResultBaseSingle<IMemberInfo>,IMemberCreate>({
                query: (data) => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "POST",
                    body: data

                }),
                invalidatesTags: ["Members"]
            }),
            updateMember: builder.mutation<IResultBaseSingle<IMemberInfo>,IMemberUpdate>({
                query: (data) => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "PUT",
                    body:data,

                }),
                invalidatesTags: ["Members"]
            }),
            fetchMembersCombo : builder.query<IResultBase<IMemberCombo>,IMemberComboFilter>({
                query: (filter) => ({
                    url: `/${URLS.MEMBERS_COMBO}`,
                    body: filter,
                    method: "POST"
                })
            }),
            fetchMembersAdmin : builder.query<IResultBase<IMemberAdmin>,void>({
                query: () => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "GET"
                })
            }),
            fetchMembersLastId : builder.query<IResultBaseSingle<ILastId>,void>({
                query: () => ({
                    url: `/${URLS.MEMBER_LAST_ID}`,
                    method: "GET"
                })
            }),
            updateStatus: builder.mutation<IResultBaseSingle<IMemberInfo>,IMemberStatus>({
                query: (status) => ({
                    url: `/${URLS.MEMBERS_STATUS}`,
                    method: "PUT",
                    body:status,

                }),
                invalidatesTags: ["Members"]
            }),
            flightSummary: builder.mutation<IResultBaseSingle<IMemberFlightSummary>,IFlightSummaryFilter>({
                query: (filter) => ({
                    url:`/${URLS.MEMBER_FLIGHT_SUMMARY}`,
                    method: "PUT",
                    body: filter
                })
            })
        }
    }
});

export const { 
    useFetchAllClubNoticeQuery,
    useFetcAllMembersQuery,
    useGetMemberByIdQuery,
    useDeleteMemberMutation, 
    useCreateMemberMutation,
    useUpdateMemberMutation,
    useFetchMembersComboQuery,
    useFetchMembersAdminQuery,
    useUpdateStatusMutation,
    useFlightSummaryMutation,
    useFetchMembersLastIdQuery
 } = apiSlice


