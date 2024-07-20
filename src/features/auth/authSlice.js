// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: { user: null, token: null, refreshToken: null },
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, access, refresh } = action.payload;

//       state.user = user;
//       state.token = access;
//       state.refreshToken = refresh;
//     },
//     logOut: (state) => {
//       state.user = null;
//       state.token = null;
//       state.refreshToken = null;
//     },
//   },
// });

// export const { setCredentials, logOut } = authSlice.actions;

// export default authSlice.reducer;

// export const selectCurrentUser = (state) => state.auth.user;
// export const selectCurrentToken = (state) => state.auth.token;
// export const selectRefreshToken = (state) => state.auth.refreshToken;
