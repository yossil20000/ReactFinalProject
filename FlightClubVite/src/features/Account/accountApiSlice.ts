import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress, URLS } from "../../Enums/Routers"
import { IAccount, IAccountBase, IAccountsCombo, IAccountsComboFilter, IOrder, IOrderBase } from "../../Interfaces/API/IAccount"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { IStatus } from "../../Interfaces/API/IStatus"

export const accountApiSlice = createApi({
  reducerPath: "accountApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: getServerAddress(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token: string = (getState() as RootState).authSlice.access_token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Accounts","Orders"],
  endpoints(builder) {
    return {
      fetchAllAccounts: builder.query<IResultBase<IAccount>, void>({
        query: () => `/${URLS.ACCOUNTS}`,
        providesTags: ["Accounts"]
      }),
      fetchAccount: builder.query<IResultBase<IAccount>, string>({
        query: (_id) => ({
          url: `/${URLS.ACCOUNTS}/${_id}`,
          method: "GET"
        }),
        providesTags: ["Accounts"],

      }),
      updateAccount: builder.mutation<IResultBaseSingle<IAccount>, IAccount>({
        query: (account) => ({
          url: `/${URLS.ACCOUNT_UPDATE}`,
          method: 'PUT',
          body: account
        }),
        invalidatesTags: [{ type: "Accounts" }]
      }),
      deleteAccount: builder.mutation<IResultBaseSingle<IAccount>, string>({
        query: (_id) => ({
          url: `/${URLS.ACCOUNT_DELETE}/${_id}`,
          method: "DELETE"
        }),
        invalidatesTags: [{ type: "Accounts" }]
      }),
      createAccount: builder.mutation<IResultBaseSingle<IAccount>, IAccountBase>({
        query: (account) => ({
          url: `/${URLS.ACCOUNT_CREATE}`,
          method: 'POST',
          body: account
        }),
        invalidatesTags: [{ type: "Accounts" }]
      }),
      fetchAccountsCombo: builder.query<IResultBase<IAccountsCombo>, void>({
        query: () => ({
          url: `/${URLS.ACCOUNTS_COMBO}`,
          method: "POST"
        })
      }),
      fetchAllOrders: builder.query<IResultBase<IOrder>, void>({
        query: () => `/${URLS.ORDERS}`,
        providesTags: ["Orders"]
      }),
      fetchOrder: builder.query<IResultBase<IOrder>, string>({
        query: (_id) => ({
          url: `/${URLS.ORDERS}/${_id}`,
          method: "GET"
        })

      }),
      deleteOrder: builder.mutation<IResultBaseSingle<IOrder>, string>({
        query: (_id) => ({
          url: `/${URLS.ORDERS_DELETE}`,
          body: {_id: _id},
          method: "DELETE"
        }),
        invalidatesTags: [{ type: "Orders" }]
      }),
      updateOrder: builder.mutation<IResultBaseSingle<IOrder>, IOrder>({
        query: (order) => ({
          url: `/${URLS.ORDERS_UPDATE}`,
          method: 'PUT',
          body: order
        }),
        invalidatesTags: ["Accounts","Orders"]
      }),
      createOrder: builder.mutation<IResultBaseSingle<IOrder>, IOrderBase>({
        query: (order) => ({
          url: `/${URLS.ORDERS_CREATE}`,
          method: 'POST',
          body: order
        }),
        invalidatesTags: [{ type: "Orders" }]
      })
    }
  }

});

export const {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useFetchAccountQuery,
  useFetchAccountsComboQuery,
  useFetchAllAccountsQuery,
  useFetchAllOrdersQuery,
  useFetchOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useCreateOrderMutation
} = accountApiSlice;