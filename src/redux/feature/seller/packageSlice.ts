import baseApi from "@/redux/api/baseApi";

export const PackageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /package/get-all-package
        getAllPackage: builder.query({
            query: () => ({
                url: "/package/get-all-package",
                method: "GET",
            }),
            providesTags: ["Package"],
        }),

        // /subscription/check-out
        subscriptionCheckOut: builder.mutation({
            query: (data) => ({
                url: "/subscription/check-out",
                method: "POST",
                body: data,
            }),    
            invalidatesTags: ["Package"],        
        }),

        // /subscription/update-subscription
        updateSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscription/update-subscription",
                method: "POST",
                body: data,
            }),    
            invalidatesTags: ["Package"],        
        }),

        // /subscription/my-subscriptions
        mySubscriptions: builder.query({
            query: () => ({
                url: "/subscription/my-subscriptions",
                method: "GET",
            }),
            providesTags: ["Package"],
        }),
    }),
});

export const {
    useGetAllPackageQuery,
    useSubscriptionCheckOutMutation,
    useUpdateSubscriptionMutation,
    useMySubscriptionsQuery,
} = PackageApi;