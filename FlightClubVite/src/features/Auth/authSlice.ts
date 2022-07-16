import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import ILogin from "../../Interfaces/API/ILogin";
interface base<T> {
    "success": boolean;
    "errors": string[];
    "data": T[];
}

interface LoginResult {
    "access_token": string;
    "exp": number;
    "iat": string;
    "expDate": string;
    "message": string;
    "member": {
        "email": string;
        "fullName": string;
    }
}


export const apiAuthSlice = createApi({
    reducerPath: 'apiAuthSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3002/api',
        prepareHeaders(headers) {

            return headers;
        }
    }),
    endpoints(builder) {
        return {
            login: builder.mutation<base<LoginResult>, ILogin>({
                query: (login) => ({
                    url: "/login",
                    method: "PUT",
                    body: login
                })
            })
        }
    }
});

export const { useLoginMutation } = apiAuthSlice


