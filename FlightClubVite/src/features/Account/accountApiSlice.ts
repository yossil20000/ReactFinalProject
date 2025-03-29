import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress} from "../../Enums/Routers"
import { URLS } from "../../Enums/Urls"
import { IAccount, IAccountsCombo, IOrder, IOrderBase } from "../../Interfaces/API/IAccount"
import { IAddTransaction, IClubAccount, IClubAccountSaving, IClubAccountsCombo, IClubAddAccount,  ITransaction, IUpdateAccountSaving } from "../../Interfaces/API/IClub"
import { IExpense, IUpsertExpanse } from "../../Interfaces/API/IExpense"
import { ITypes } from "../../Interfaces/API/ITypes"
import { IFilter } from "../../Interfaces/API/IFilter"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { getUrlWithParams } from "../../Utils/url"
import { IDateFilter } from "../../Interfaces/IDateFilter"
import { ICreateQuarterExpense } from "../../Pages/Account/CreateQuarterDialoq"
import { ICreateOrderExpense } from "../../Pages/Account/CreateOrderExpenseDialoq"

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
    /* credentials: "same-origin", */
  }),
  tagTypes: ["Accounts","Orders","ClubAccount","Expense","Transaction"],
  endpoints(builder) {
    return {
      fetchAllAccounts: builder.query<IResultBase<IAccount>, IFilter>({
        query: (filter) =>({
          url: `/${URLS.ACCOUNTS}`,
          method: "GET"
        }), 
        providesTags: ["Accounts"],
        transformResponse: (response : IResultBase<IAccount>) => {
                  CustomLogger.info("fetchAllAccounts/response", response);
                  
                  return response;
                }
      }),
      fetchAccount: builder.query<IResultBase<IAccount>, string>({
        query: (_id) => ({
          url: `/${URLS.ACCOUNTS}/${_id}`,
          method: "GET"
        }),
        providesTags: ["Accounts"],

      }),
      fetchAccountSearch: builder.query<IResultBase<IAccount>,  {[key: string]: string} >({
        query: (params) => ({
          url:getUrlWithParams(`/${URLS.ACCOUNTS_SEARCH}`,params) ,
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
      createQuarterOrder: builder.mutation<IResultBaseSingle<IOrder>, ICreateQuarterExpense>({
        query: (order) => ({
          url: `/${URLS.ORDERS_QUARTER_CREATE}`,
          method: 'POST',
          body: order
        }),
        invalidatesTags: [{ type: "Orders" }]
      }),
      createExpenseOrder: builder.mutation<IResultBaseSingle<IOrder>, ICreateOrderExpense>({
        query: (order) => ({
          url: `/${URLS.ORDERS_EXPESE_CREATE}`,
          method: 'POST',
          body: order
        }),
        invalidatesTags: [{ type: "Orders" }]
      }),
      clubAccount: builder.query<IResultBase<IClubAccount>, boolean>({
        query: (include_accounts) => ({
          url: `/${URLS.CLUB}/${include_accounts}`,
          method: 'GET'
        }),
        providesTags: [{type: "ClubAccount"}]
      }),
      clubAccountCombo: builder.query<IResultBase<IClubAccountsCombo>, void>({
        query: () => ({
          url: `/${URLS.CLUB_COMBO}`,
          method: 'POST'
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
      clubAddOrderTransaction: builder.mutation<IResultBaseSingle<IClubAccount>,IAddTransaction >({
        query: (addTransaction) => ({
          url: `/${URLS.CLUB_ADD_ORDER_TRANSACTION}`,
          method: 'PUT',
          body: addTransaction
        }),
        invalidatesTags: [{ type: "ClubAccount" } , { type: "Orders" }]
      }),
      clubAddTransaction: builder.mutation<IResultBaseSingle<IClubAccount>,IAddTransaction >({
        query: (addTransaction) => ({
          url: `/${URLS.CLUB_ADD_TRANSACTION}`,
          method: 'PUT',
          body: addTransaction
        }),
        invalidatesTags: [{ type: "ClubAccount" } , { type: "Orders" },{type: "Transaction"}]
      }),
      clubAddTransactionType: builder.mutation<IResultBaseSingle<IClubAccount>,IAddTransaction >({
        query: (addTransaction) => ({
          url: `/${URLS.CLUB_ADD_TRANSACTION_TYPE}`,
          method: 'PUT',
          body: addTransaction
        }),
        invalidatesTags: [{ type: "ClubAccount" } , { type: "Orders" },{type: "Transaction"}]
      }),
      clubAddTransactionPayment: builder.mutation<IResultBaseSingle<IClubAccount>,IAddTransaction >({
        query: (addTransaction) => ({
          url: `/${URLS.CLUB_ADD_TRANSACTION_PAYMENT}`,
          method: 'PUT',
          body: addTransaction
        }),
        invalidatesTags: [{ type: "ClubAccount" } , { type: "Orders" },{type: "Transaction"}]
      }),
      fetchExpense: builder.query<IResultBase<IExpense>, IFilter>({
        query: (filter) => ({
          url: `/${URLS.CLUB_EXPENSE}`,
          method: "PATCH",
          params: filter
        }),
        providesTags: ["Expense"]
      }),
      createExpense: builder.mutation<IResultBaseSingle<IExpense>,IUpsertExpanse>({
        query: (filter) => ({
          url: `/${URLS.CLUB_CREATE_EXPENSE}`,
          method: "PUT",
          body: filter
        }),
        invalidatesTags: ["Expense"]
        
      }),
      updateExpense: builder.mutation<IResultBaseSingle<IExpense>,IUpsertExpanse>({
        query: (expense) => ({
          url: `/${URLS.CLUB_UPDATE_EXPENSE}`,
          method: "POST",
          body: expense
        }),
        invalidatesTags: ["Expense"]
        
      }),
      deleteExpense: builder.mutation<IResultBaseSingle<IExpense>,string>({
        query: (_id) => ({
          url: `/${URLS.CLUB_DELETE_EXPENSE}/${_id}`,
          method: "DELETE"
        }),
        invalidatesTags: ["Expense"]
        
      }),
      fetchTransaction: builder.query<IResultBase<ITransaction>,IDateFilter>({
        query: (filter) => ({
          
          url:`/${URLS.CLUB_TRANSACTION_SEARCH}?from=${filter.from}&to=${filter.to}`,
          method: 'GET'
        })
      }),

      fetchTypes: builder.query<IResultBaseSingle<ITypes>,string>({
        query: (key) => ({
          url: `/${URLS.TYPES}/${key}`,
          method: "GET",

        })
      }),
      fetchAccountSaving: builder.query<IResultBaseSingle<IClubAccountSaving>,string>({
        query: (key) => ({
          url:`/${URLS.CLUB_RESERV}/${key}`,
          method: "GET"
        })
      }),
      updateAccountSaving: builder.mutation<IResultBaseSingle<IClubAccountSaving>,IUpdateAccountSaving>({
        query: (body) => ({
          url: `/${URLS.CLUB_RESERV}`,
          method: "POST",
          body: body
        })
      })
      
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
  useFetchAccountSearchQuery,
  useFetchAllOrdersQuery,
  useFetchOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useCreateOrderMutation,
  useGetOrderSearchQuery,
  useClubAccountQuery,
  useClubAddAccountMutation,
  useClubAccountComboQuery,
  useClubAddOrderTransactionMutation,
  useClubAddTransactionMutation,
  useClubAddTransactionTypeMutation,
  useClubAddTransactionPaymentMutation,
  useFetchExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useFetchTypesQuery,
  useFetchTransactionQuery,
  useCreateQuarterOrderMutation,
  useCreateExpenseOrderMutation,
  useFetchAccountSavingQuery,
  useUpdateAccountSavingMutation
} = accountApiSlice;