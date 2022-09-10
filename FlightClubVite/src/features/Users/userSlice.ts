import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import IResultBase, { IResultBaseSingle } from '../../Interfaces/API/IResultBase'
import {URLS} from '../../Enums/Routers';
import IClubNotice from "../../Interfaces/API/IClubNotice";
import IMember from "../../Interfaces/API/IMember";
import IMemberInfo from "../../Interfaces/IMemberInfo";
import { RootState } from "../../app/userStor";
import { IMemberCombo } from "../../Interfaces/IFlightReservationProps";


interface Role {
    "user": string;
    "account": string;
}
interface Member {
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
}
export interface LogingProp {
    "password": string;
    "email": string;
}


export const apiSlice = createApi({
    reducerPath: 'apiSlice',
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
                    }
                ) ,
                providesTags: ["Members"]
            }
            ),
            deleteMember: builder.mutation<IResultBaseSingle<IMemberInfo>,string>({
                query: (_id) => ({
                    url: `/${URLS.MEMBERS}/${_id}`,
                    method: "DELETE",

                }),
                invalidatesTags: ["Members"]
            }),
            createMember: builder.mutation<IResultBaseSingle<IMemberInfo>,IMember>({
                query: (data) => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "POST",
                    body: data

                }),
                invalidatesTags: ["Members"]
            }),
            updateMember: builder.mutation<IResultBaseSingle<IMemberInfo>,IMemberInfo>({
                query: (data) => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "PUT",
                    body:data,

                }),
                invalidatesTags: ["Members"]
            }),
            fetchMembersCombo : builder.query<IResultBase<IMemberCombo>,void>({
                query: () => ({
                    url: `/${URLS.MEMBERS}`,
                    method: "GET"
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
    useFetchMembersComboQuery
 } = apiSlice


