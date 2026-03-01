import baseApi from "@/redux/api/baseApi";

export const orderProductApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        orderHistory: builder.query({
query: ({ page = 1 }) => ({
                url: `/order/get-all-order-for-buyer?page=${page}`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),

        // /order/get-single-order/69668073c65183a8b28f4ce6
        orderHistoryDetail: builder.query({
            query: (id: string) => ({
                url: `/order/get-single-order/${id}`,
                method: "GET",
            }),
            providesTags: ["Order"],
        }),
    }),
});

export const {
    useOrderHistoryQuery,
    useOrderHistoryDetailQuery,
} = orderProductApi;