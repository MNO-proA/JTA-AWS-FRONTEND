// expensesSlice.js
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const expensesAdapter = createEntityAdapter({
    selectId: (entity) => entity.expenseID,
    sortComparer: (a, b) => new Date(b.startDate) - new Date(a.startDate),
});

const initialState = expensesAdapter.getInitialState();

export const expenseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => '/expenses',
      transformResponse: (responseData) => {
        return expensesAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => 
        result
          ? [
              ...result.ids.map(id => ({ type: 'Expenses', id })),
              { type: 'Expenses', id: 'LIST' }
            ]
          : [{ type: 'Expenses', id: 'LIST' }],
      keepUnusedDataFor: 86400, // 24 hours in seconds
    }),
    addExpense: builder.mutation({
      query: (newExpense) => ({
        url: '/expenses',
        method: 'POST',
        body: newExpense,
      }),
      async onQueryStarted(newExpense, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            expensesAdapter.addOne(draft, newExpense);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body: updates,
      }),
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            expensesAdapter.updateOne(draft, { id, changes: updates });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            expensesAdapter.removeOne(draft, id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApiSlice;

// Selectors
export const selectExpensesResult = expenseApiSlice.endpoints.getExpenses.select();

const selectExpensesData = createSelector(
  selectExpensesResult,
  (expensesResult) => expensesResult.data
);

export const {
  selectAll: selectAllExpenses,
  selectById: selectExpenseById,
  selectIds: selectExpenseIds,
} = expensesAdapter.getSelectors((state) => selectExpensesData(state) ?? initialState);