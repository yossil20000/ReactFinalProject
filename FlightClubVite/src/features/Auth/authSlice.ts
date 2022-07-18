import base from "@emotion/styled/types/base";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URLS } from "../../Enums/Routers";
import ILogin, { ILoginResult, IReset, IResetResult } from "../../Interfaces/API/ILogin";
import IResultBase from "../../Interfaces/API/IResultBase";

export const apiAuthSlice = createApi({
    reducerPath: 'apiAuthSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: URLS.BACKEND_URL,
        prepareHeaders(headers) {

            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation<IResultBase<ILoginResult>, ILogin>({
                query: (login) => ({
                    url: `/${URLS.LOGIN}`,
                    method: "PUT",
                    body: login
                })
            }),
            reset: builder.mutation<IResultBase<IResetResult>,IReset>({
                query: (reset) => ({
                    url: `/${URLS.RESET}`,
                    method: "PUT",
                    body: reset
                })
            })
        }
    }
});

export const { useLoginMutation,useResetMutation } = apiAuthSlice


