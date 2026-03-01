/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit"

interface UserState {
  user: any | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    stopLoading: (state) => {
      state.loading = false
    },
  },
})

export const { setUser, logout, stopLoading } = authSlice.actions
export default authSlice.reducer
