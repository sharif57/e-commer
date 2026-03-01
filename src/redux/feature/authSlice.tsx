"use client";

import baseApi from "../api/baseApi";



export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/user/create-buyer",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, ...data }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data,
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : undefined,
        };
      },
    }),

    googleLogin: builder.mutation({
      query: (data) => ({
        url: "/auth/google-login",
        method: "POST",
        body: data,
      }),
    }),

    facebookLogin: builder.mutation({
      query: ({ accessToken }) => ({
        url: "/auth/login/facebook",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = authApi;