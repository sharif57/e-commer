import baseApi from "@/redux/api/baseApi";

export const accountSettingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    //   /account-health-response/account-health-ratio
    accountHealthRatio: builder.query({
            query: () => ({
                url: `/account-health-response/account-health-ratio`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),


        allSalesReport: builder.query({
            query: () => ({
                url: `/account-health-response/all-sales-report`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),

        // /account-health-response/account-msg-response
        accountMsgResponse: builder.query({
            query: () => ({
                url: `/account-health-response/account-msg-response`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),

        // /account-health-response/on-time-delivery-ratio
        onTimeDeliveryRatio: builder.query({
            query: () => ({
                url: `/account-health-response/on-time-delivery-ratio`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),

        // /account-health-response/all-review-and-rating-ratio
        allReviewAndRatingRatio: builder.query({
            query: () => ({
                url: `/account-health-response/all-review-and-rating-ratio`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),
        // /seller-wallet/get-data?period=weekly
        sellerWalletData: builder.query({
            query: (params) => ({
                url: `/seller-wallet/get-data?period=${params}`,    
                method: "GET",
            }),
            providesTags: ["AccountHealthRatio"],
        }),

    }),
});

export const {
   useAccountHealthRatioQuery,
    useAllSalesReportQuery,
    useAccountMsgResponseQuery,
    useOnTimeDeliveryRatioQuery,
    useAllReviewAndRatingRatioQuery,
    useSellerWalletDataQuery,
} = accountSettingApi;