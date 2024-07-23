// shiftsSlice.js
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const shiftsAdapter = createEntityAdapter({
    selectId: (entity) => entity.shiftID,
    sortComparer: (a, b) => new Date(b.startDate) - new Date(a.startDate),
});

const initialState = shiftsAdapter.getInitialState();

export const shiftApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: () => '/shifts',
      transformResponse: (responseData) => {
        return shiftsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result) => 
        result
          ? [
              ...result.ids.map(id => ({ type: 'Shifts', id })),
              { type: 'Shifts', id: 'LIST' }
            ]
          : [{ type: 'Shifts', id: 'LIST' }],
      keepUnusedDataFor: 86400, // 24 hours in seconds
    }),
    addShift: builder.mutation({
      query: (newShift) => ({
        url: '/shifts',
        method: 'POST',
        body: newShift,
      }),
      async onQueryStarted(newShift, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            shiftsAdapter.addOne(draft, newShift);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateShift: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/shifts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      async onQueryStarted({ id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            shiftsAdapter.updateOne(draft, { id, changes: updates });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            shiftApiSlice.util.updateQueryData('getShifts', undefined, (draft) => {
            shiftsAdapter.removeOne(draft, id);
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
  useGetShiftsQuery,
  useAddShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} = shiftApiSlice;

// Selectors
export const selectShiftsResult = shiftApiSlice.endpoints.getShifts.select();

const selectShiftsData = createSelector(
  selectShiftsResult,
  (shiftsResult) => shiftsResult.data
);

export const {
  selectAll: selectAllShifts,
  selectById: selectShiftById,
  selectIds: selectShiftIds,
} = shiftsAdapter.getSelectors((state) => selectShiftsData(state) ?? initialState);