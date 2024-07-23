import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../../features/auth/authSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    try {
      let result = await baseQuery(args, api, extraOptions);
  
      if (result.error) {
        if (result.error.status === 401) {
          // Handle unauthorized errors
          api.dispatch(logOut());
        } else {
          // Handle other HTTP errors
          console.error("API Error:", result.error);
        }
      }
  
      return result;
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected Error:", error);
      throw error; // Re-throw the error to be handled by calling code
    }
  };

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // eslint-disable-next-line no-unused-vars
   tagTypes: ['Staff', 'Shifts', 'Expenses'],
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});
