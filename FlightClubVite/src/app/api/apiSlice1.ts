
import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URLS } from "../../Enums/Routers";
//https://www.youtube.com/watch?v=-JJFQ9bkUbo
import { setCredentials,logOut } from "../../features/Auth/authSlice1";
import IAuth from "../../Interfaces/API/IAuth";
import type { RootState } from "../store1";

const baseQuery = fetchBaseQuery({
    baseUrl:URLS.BACKEND_URL,
    //http only secure cooke
    credentials: 'include',
    prepareHeaders: (headers,{getState}) => {
        const token = (getState() as RootState).auth.token;
        if(token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args:string | FetchArgs,api:BaseQueryApi,extraOptions:any) => {
    let result = await baseQuery(args,api,extraOptions);
    if(result?.error?.status === 403){
        console.log('sending refresh token');
        const refreshResult = await baseQuery('api/refresh',api,extraOptions);
        console.log('refreshToken', refreshResult);
        if(refreshResult?.data){
            const user = (api.getState() as RootState).auth.user;
            //stor the new token
            const auth : IAuth = {
                user: user,
                token: refreshResult?.data as string
            }
            api.dispatch(setCredentials(auth))
            //retry the originalquery with the new access token
            result = await baseQuery(args,api,extraOptions);

        }
        else{
            api.dispatch(logOut());
        }
    }
    return result;
}
export const apiSlice1 = createApi({

    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})

    
});


