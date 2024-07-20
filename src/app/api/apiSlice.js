// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logOut } from "../../features/auth/authSlice";
// import { refreshAccessToken } from "../../utils/utilsFunc";

// const baseQuery = fetchBaseQuery({
//   baseUrl: "https://jta.pythonanywhere.com/api",
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.token;
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     console.log("sending refresh token");
//     // send refresh token to get new access token
//     // console.log(api.getState().auth.refreshToken);
//     const refreshResult = await refreshAccessToken(
//       api.getState().auth.refreshToken
//     );
//     // console.log(`access: ${refreshResult}`);
//     if (refreshResult) {
//       const user = api.getState().auth.user;
//       const refresh = api.getState().auth.refreshToken;
//       // store the new token
//       const access = refreshResult || null;
//       api.dispatch(setCredentials({ access, user, refresh }));
//       // retry the original query with new access token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logOut());
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   baseQuery: baseQueryWithReauth,
//   // eslint-disable-next-line no-unused-vars
//   tagTypes: ["Tracks", "Employees"],
//   // eslint-disable-next-line no-unused-vars
//   endpoints: (builder) => ({}),
// });
