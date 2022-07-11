import {createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const DOGS_API_KEY = 'cbfb51a2-84b6-4025-a3e2-ed8616edf311'
interface base<T>{
    "success": boolean;
    "errors": string[];
    "data": T[];
}
interface Breed {
    "success": boolean;
    "errors": string[];
    "data": 
        {
            "_id": string;
            "title": string;
            "description":string;
            "issue_date": Date;
            "due_date": Date;
        }[]
}
interface  Role{
    "user": string;
    "account" : string; 
}
interface Member{
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



export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3002/api',
        prepareHeaders(headers){
            headers.set('x-api-key',DOGS_API_KEY);
           return headers; 
        }
    }),
endpoints(builder){
    return {
        fetchBreeds : builder.query<Breed, number|void>({
            query(limit = 10){ return `/club_notice`;}
        }),
        fetcAllMembers : builder.query<base<Member>,void>({
            query() {return 'members'}
        })
    }
}
});

export const {useFetchBreedsQuery,useFetcAllMembersQuery} = apiSlice


