import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

// Helper function to extract numeric part of staffID
const extractNumericPart = (staffID) => {
    const match = staffID.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const staffAdapter = createEntityAdapter({
    selectId: (entity) => entity.staffID,
    sortComparer: (a, b) => extractNumericPart(b.staffID) - extractNumericPart(a.staffID), // Sort by numeric part of staffID in descending order
});

const initialState = staffAdapter.getInitialState();

export const staffApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStaff: builder.query({
            query: () => '/staff',
            transformResponse: (responseData) => {
                return staffAdapter.setAll(initialState, responseData);
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.ids.map(id => ({ type: 'Staff', id })),
                        { type: 'Staff', id: 'LIST' }
                    ]
                    : [{ type: 'Staff', id: 'LIST' }],
            keepUnusedDataFor: 86400, // 24 hours in seconds
        }),
        addStaff: builder.mutation({
            query: (newStaff) => ({
                url: '/staff',
                method: 'POST',
                body: newStaff,
            }),
            async onQueryStarted(newStaff, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    staffApiSlice.util.updateQueryData('getStaff', undefined, (draft) => {
                        staffAdapter.addOne(draft, newStaff);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateStaff: builder.mutation({
          query: ({ staffID, updates }) => ({
              url: `/staff/${staffID}`,
              method: 'PUT',
              body: { updates },
          }),
          async onQueryStarted({ staffID, updates }, { dispatch, queryFulfilled }) {
              const patchResult = dispatch(
                  staffApiSlice.util.updateQueryData('getStaff', undefined, (draft) => {
                    staffAdapter.updateOne(draft, { id: staffID, changes: updates });
                  })
              );
              try {
                  const { data: updatedStaff } = await queryFulfilled;
                  dispatch(
                      staffApiSlice.util.updateQueryData('getStaff', undefined, (draft) => {
                          staffAdapter.upsertOne(draft, updatedStaff);
                      })
                  );
              } catch {
                  patchResult.undo();
              }
          },
      }),
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `/staff/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    staffApiSlice.util.updateQueryData('getStaff', undefined, (draft) => {
                        staffAdapter.removeOne(draft, id);
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
    useGetStaffQuery,
    useAddStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
} = staffApiSlice;

// Selectors
export const selectStaffResult = staffApiSlice.endpoints.getStaff.select();

const selectStaffData = createSelector(
    selectStaffResult,
    (staffResult) => staffResult.data
);

export const {
    selectAll: selectAllStaff,
    selectById: selectStaffById,
    selectIds: selectStaffIds,
    selectTotal: selectStaffsTotal
} = staffAdapter.getSelectors((state) => selectStaffData(state) ?? initialState);
