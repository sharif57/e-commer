import baseApi from "@/redux/api/baseApi";

export const walletApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /wallet/my-wallet
        getSellerWallet: builder.query({
            query: () => ({
                url: '/wallet/my-wallet',
                method: 'GET',
            }),
            providesTags: ['Wallet'],
        }),

        // /wallet/get-all-wallet
        getAllSellerWallets: builder.query({
            query: () => ({
                url: '/wallet/get-all-wallet',
                method: 'GET',
            }),
            providesTags: ['Wallet'],
        }),

        // /withdraw/my-withdraw-history
        getSellerWithdrawHistory: builder.query({
            query: () => ({
                url: '/withdraw/my-withdraw-history',
                method: 'GET',
            }),
            providesTags: ['Wallet'],
        }),

        // /withdraw/request-withdraw
        requestSellerWithdraw: builder.mutation({
            query: (data) => ({
                url: '/withdraw/request-withdraw',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Wallet'],
        }),
    }),
});

export const {
    useGetSellerWalletQuery,
    useGetAllSellerWalletsQuery,
    useGetSellerWithdrawHistoryQuery,
    useRequestSellerWithdrawMutation,
} = walletApi;