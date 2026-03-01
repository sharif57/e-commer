import baseApi from "@/redux/api/baseApi";

export const buyerSupportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    //    /buyer-support/send
        buyerSupport: builder.mutation({
            query: (supportData) => ({
                url: `/buyer-support/send`,
                method: "POST",
                body: supportData,
            }),
            invalidatesTags: ["BuyerSupport"],
        }),

    }),
});

export const {
    useBuyerSupportMutation,
} = buyerSupportApi;