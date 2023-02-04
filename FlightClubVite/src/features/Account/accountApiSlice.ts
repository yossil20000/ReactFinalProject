import { Filter } from "@mui/icons-material"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress, URLS } from "../../Enums/Routers"
import { IAccount, IAccountBase, IAccountsCombo, IAccountsComboFilter, IOrder, IOrderBase } from "../../Interfaces/API/IAccount"
import { IAddTransaction, IClubAccount, IClubAccountsCombo, IClubAddAccount } from "../../Interfaces/API/IClub"
import { IFilter } from "../../Interfaces/API/IFilter"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { IStatus } from "../../Interfaces/API/IStatus"
import { getUrlWithParams } from "../../Utils/url"

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
  tagTypes: ["Accounts","Orders","ClubAccount"],
  endpoints(builder) {
    return {
      fetchAllAccounts: builder.query<IResultBase<IAccount>, IFilter>({
        query: (filter) =>({
          url: `/${URLS.ACCOUNTS}`,
          method: "GET"
        }), 
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
      createAccount: builder.mutation<IResultBaseSingle<IAccount>, string>({
        query: (member_id) => ({
          url: `/${URLS.ACCOUNT_CREATE}`,
          method: 'POST',
          body: {member_id: member_id}
        }),
        invalidatesTags: [{ type: "Accounts" }]
      }),
      fetchAccountsCombo: builder.query<IResultBase<IAccountsCombo>, void>({
        query: () => ({
          url: `/${URLS.ACCOUNTS_COMBO}`,
          method: "POST"
        })
      }),
      fetchAllOrders: builder.query<IResultBase<IOrder>, IFilter>({
        query: (filter) => ({
          url: `/${URLS.ORDERS}`,
          method: "GET",
          params: filter
        }),
        providesTags: ["Orders"]
      }),
      getOrderSearch: builder.query<IResultBase<IOrder>,{[key: string]: string}>({
        query: (filter) => ({
          url:getUrlWithParams(`/${URLS.ORDERS_SEARCH}/filter`,filter) ,
          method: "GET"
        }),
        providesTags: ["Orders"]
      }),
      fetchOrder: builder.query<IResultBase<IOrder>, string>({
        query: (_id) => ({
          url: `/${URLS.ORDERS}/${_id}`,
          method: "GET"
        }),
        providesTags: ["Orders"]

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
      }),
      clubAccount: builder.query<IResultBase<IClubAccount>, void>({
        query: () => ({
          url: `/${URLS.CLUB}`,
          method: 'GET'
        }),
        providesTags: [{type: "ClubAccount"}]
      }),
      clubAccountCombo: builder.query<IResultBase<IClubAccountsCombo>, void>({
        query: () => ({
          url: `/${URLS.CLUB_COMBO}`,
          method: 'GET'
        })
      }),
      clubAddAccount: builder.mutation<IResultBaseSingle<IClubAccount>,IClubAddAccount >({
        query: (addAccount) => ({
          url: `/${URLS.CLUB_ADD_ACCOUNT}`,
          method: 'PUT',
          body: addAccount
        }),
        invalidatesTags: [{ type: "ClubAccount" }]
      }),
      clubAddTransaction: builder.mutation<IResultBaseSingle<IClubAccount>,IAddTransaction >({
        query: (addTransaction) => ({
          url: `/${URLS.CLUB_ADD_TRANSACTION}`,
          method: 'PUT',
          body: addTransaction
        }),
        invalidatesTags: [{ type: "ClubAccount" } , { type: "Orders" }]
      }),

    }
  }

});

export const {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useFetchAccountQuery,
  useFetchAccountsComboQuery,
  useFetchAllAccountsQuery,
  useFetchAllOrdersQuery,
  useFetchOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useCreateOrderMutation,
  useGetOrderSearchQuery,
  useClubAccountQuery,
  useClubAddAccountMutation,
  useClubAccountComboQuery,
  useClubAddTransactionMutation
} = accountApiSlice;