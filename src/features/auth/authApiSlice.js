import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/token",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // logout: builder.mutation({
    //   query: (refreshToken) => ({
    //     url: "/admin/auth/logout",
    //     method: "POST",
    //     body: { refresh_token: refreshToken },
    //   }),
    // }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;
