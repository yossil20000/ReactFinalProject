import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../../app/userStor"
import { getServerAddress} from "../../Enums/Routers"
import { URLS } from "../../Enums/Urls"
import IResultBase, { IResultBaseSingle } from "../../Interfaces/API/IResultBase"
import { IExpenseItem } from "../../Interfaces/API/IExpenseItem"

export const expenseItemApiSlice = createApi({
  reducerPath: "expenseItemApiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: getServerAddress(),
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests 
      const token : string = (getState() as RootState).authSlice.access_token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["ExpenseItem"],
  endpoints(builder){
    return{
      fetchAllExpenseItems: builder.query<IResultBase<IExpenseItem>,void>({
        query: () => ({
          url: `/${URLS.EXPENSE_ITEM}`,
          method: "GET"
        }),
        providesTags: ["ExpenseItem"],
        transformResponse: (response : IResultBase<IExpenseItem>) => {
          CustomLogger.info("fetchAllExpenseItems/response", response);
          return response;
        }
      }),
      fetchExpenseItem: builder.query<IResultBaseSingle<IExpenseItem>,string>({
        query: (_id) => ({
          url:  `/${URLS.EXPENSE_ITEM}/${_id}`,
          method: "GET"
        }),
        providesTags: ["ExpenseItem"],
        transformResponse: (response : IResultBaseSingle<IExpenseItem>) => {
          CustomLogger.info("fetchExpenseItem/response", response);
          return response;
        }
      }),
      createExpenseItem: builder.mutation<IResultBaseSingle<IExpenseItem>,IExpenseItem>({
        query: (expenseItem) => ({
          url: `/${URLS.EXPENSE_ITEM_CREATE}`,
          body: expenseItem,
          method: "POST"
        }),
        invalidatesTags: ["ExpenseItem"]
      }),
      updateExpenseItem: builder.mutation<IResultBaseSingle<IExpenseItem>,IExpenseItem>({ 
        query: (expenseItem) => ({
          url: `/${URLS.EXPENSE_ITEM_UPDATE}`,
          body: expenseItem,
          method: "PUT"
        }),
        invalidatesTags: ["ExpenseItem"]
      }),
      deleteExpenseItem: builder.mutation<IResultBaseSingle<IExpenseItem>,string>({
        query: (_id) => ({
          url: `/${URLS.EXPENSE_ITEM_DELETE}`,
          body: {_id: _id},
          method: "DELETE"
        }),
        invalidatesTags: ["ExpenseItem"]
      }),
    }
  } 
})
export const {
  useFetchAllExpenseItemsQuery,
  useFetchExpenseItemQuery,
  useCreateExpenseItemMutation,
  useUpdateExpenseItemMutation,
  useDeleteExpenseItemMutation
} = expenseItemApiSlice;

