import {apiSlice1} from "../../app/api/apiSlice1"
import { URLS } from "../../Enums/Routers"

export const authApiSlice1 = apiSlice1.injectEndpoints({
    endpoints: builder => ({
        newlogin: builder.mutation({
           query: credentials => ({
            url: `/${URLS.LOGIN}`,
            method: "PUT",
            body: {...credentials}
           })
        }),
    })
})

export const { useNewloginMutation } = authApiSlice1