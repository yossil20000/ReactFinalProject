import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import IResultBase from '../../Interfaces/API/IResultBase'
import {URLS} from '../../Enums/Routers';
interface Breed {
    "success": boolean;
    "errors": string[];
    "data":
    {
        "_id": string;
        "title": string;
        "description": string;
        "issue_date": Date;
        "due_date": Date;
    }[]
}
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
        prepareHeaders(headers) {

            return headers;
        }
    }),
    endpoints(builder) {
        return {
            fetchBreeds: builder.query<Breed, number | void>({
                query(limit = 10) { return `/${URLS.CLUB_NOTICE}`; }
            }),
            fetcAllMembers: builder.query<IResultBase<Member>, void>({
                query() { return `/${URLS.MEMBERS}` }
            })
        }
    }
});

export const { useFetchBreedsQuery, useFetcAllMembersQuery } = apiSlice


