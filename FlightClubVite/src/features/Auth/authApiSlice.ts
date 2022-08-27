import base from "@emotion/styled/types/base";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URLS } from "../../Enums/Routers";
import ILogin, { ILoginResult, IReset, IResetResult } from "../../Interfaces/API/ILogin";
import { IResultBaseSingle } from "../../Interfaces/API/IResultBase";
import {RootState} from '../../app/userStor'

export const authApiSlice = createApi({
    reducerPath: 'apiAuthSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: URLS.BACKEND_URL,
        prepareHeaders: (headers, { getState }) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const token = (getState() as RootState).authSlice.access_token
            if (token) {
              headers.set('authorization', `Bearer ${token}`)
            }
            return headers
          },
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
            reset: builder.mutation<IResultBaseSingle<IResetResult>,IReset>({
                query: (reset) => ({
                    url: `/${URLS.RESET}`,
                    method: "PUT",
                    body: reset
                })
            })
        }
    }
});

export const { useLoginMutation,useResetMutation } = authApiSlice


