import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const expensesAdapter = createEntityAdapter({
    selectId: (entity) => entity.expenseID,
    sortComparer: (a, b) => new Date(b.date) - new Date(a.date),
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
        url: '/expense',
        method: 'POST',
        body: newExpense,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
      async onQueryStarted(newExpense, { dispatch, queryFulfilled }) {
        const tempId = Date.now().toString();
        const patchResult = dispatch(
          expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            expensesAdapter.addOne(draft, { ...newExpense, expenseID: tempId });
          })
        );
        try {
          await queryFulfilled;
          // The optimistic update becomes permanent if the request is successful
        } catch {
          // Undo the optimistic update if the request fails
          patchResult.undo();
        }
      },
    }),
    updateExpense: builder.mutation({
      query: ({ expenseId, ...updates }) => ({
        url: `/expense/${expenseId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { expenseId }) => [{ type: 'Expenses', id: expenseId }],
      async onQueryStarted({ expenseId, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            expensesAdapter.updateOne(draft, { id: expenseId, changes: updates });
          })
        );
        try {
          await queryFulfilled;
          // Optionally, you can refetch the data
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteExpense: builder.mutation({
      query: ({ expenseId, date }) => ({
        url: `/expense/${expenseId}/${date}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { expenseId }) => [{ type: 'Expenses', id: expenseId }],
      async onQueryStarted({ expenseId, date }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          expenseApiSlice.util.updateQueryData('getExpenses', undefined, (draft) => {
            const index = draft.ids.findIndex(id => {
              const expense = draft.entities[id];
              return expense.expenseID === expenseId && expense.date === date;
            });
            if (index !== -1) {
              const id = draft.ids[index];
              expensesAdapter.removeOne(draft, id);
            }
          })
        );
        try {
          await queryFulfilled;
          // If successful, the optimistic update is kept
        } catch {
          // If error occurs, revert the optimistic update
          patchResult.undo();
        }
      },
    }),
    // deleteExpense: builder.mutation({
    //   query: ({ id, date }) => ({
    //         url: `/expense/${id}/${date}`,
    //         method: 'DELETE',
    //       }),
    //   invalidatesTags: (result, error, arg) => [
    //     { type: 'Expenses', id: arg.id },
    //   ],
    // }),
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
