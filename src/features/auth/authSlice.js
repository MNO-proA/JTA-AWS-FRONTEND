import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { role: null, token: null  },
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, role } = action.payload;

      state.token = access_token;
      state.role = role;
   
    },
    logOut: (state) => {
    
      state.token = null;
     
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentRole = (state) => state.auth.role;
export const selectCurrentToken = (state) => state.auth.token;

