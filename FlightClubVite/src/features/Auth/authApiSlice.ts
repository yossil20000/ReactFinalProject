import base from "@emotion/styled/types/base";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {  URLS,getServerAddress } from "../../Enums/Routers";
import ILogin, { IChangePassword, IChangePasswordResults, ILoginResult, IRefreshToken, IReset, IResetResult } from "../../Interfaces/API/ILogin";
import { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import {RootState} from '../../app/userStor'

export const authApiSlice = createApi({
    reducerPath: 'apiAuthSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: getServerAddress(),
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).authSlice.access_token
            if (token) {
              headers.set('authorization', `Bearer ${token}`)
            }
            return headers
          },
          /* credentials: "include" */
    }),
    endpoints(builder) {
        return {
            login: builder.mutation<IResultBaseSingle<ILoginResult>, ILogin>({
                query: (login) => ({
                    url: `/${URLS.LOGIN}`,
                    method: "PUT",
                    body: login
                })
            }),
            refresh: builder.mutation<IResultBaseSingle<ILoginResult>, IRefreshToken>({
                query: (refresh) => ({
                    url: `/${URLS.REFRESH}`,
                    method: "PUT",
                    body: refresh
                })
            }),
            reset: builder.mutation<IResultBaseSingle<IResetResult>,IReset>({
                query: (reset) => ({
                    url: `/${URLS.RESET}`,
                    method: "PUT",
                    body: reset
                })
            }),
            changePassword: builder.mutation<IResultBaseSingle<IChangePasswordResults>,IChangePassword>({
                query: (changePassword) => ({
                    url:`/${URLS.CHANGE_PASSWORD}`,
                    method: "PUT",
                    body: changePassword
                })
            })
        }
    }
});

export const { 
    useLoginMutation,
    useResetMutation,
    useChangePasswordMutation,
    useRefreshMutation
 } = authApiSlice


