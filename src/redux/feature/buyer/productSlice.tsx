import baseApi from "@/redux/api/baseApi";


export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (page) => ({
                url: `/product/get-all-products?page=${page}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        getSingleProduct: builder.query({
            query: (productId: string) => ({
                url: `/product/get-single-product/${productId}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        disableProduct: builder.query({
            query: () => ({
                url: `/product/disable-product`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        // /order/create-order
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: `/order/create-order`,
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Product"],
        }),

        // /payment/create-checkout-session
        createCheckoutSession: builder.mutation({
            query: (orderData) => ({
                url: `/payment/create-checkout-session`,
                method: "POST",
                body: orderData,
            }),
            invalidatesTags: ["Product"],
        }),

        // /product/get-all-products?categoryName=hi&minPrice=2000&maxPrice=3000
        getProductsByFilter: builder.query({
            query: (filterData) => ({
                url: `/product/get-all-products`,
                method: "GET",
                params: filterData,
            }),
            providesTags: ["Product"],
        }),

        // about/get-seller-about/6932a3d77d740510efe6d778
        getSellerAbout: builder.query({
            query: (id: string) => ({
                url: `/about/get-seller-about/${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),

        // /review/get-all-data/6932a3d77d740510efe6d778
        getSellerFeedback: builder.query({
            query: (id: string) => ({
                url: `/review/get-all-data/${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),

        // /review/review-count/69183979d61cd430dd18ee5e
        getReviewCount: builder.query({
            query: (id: string) => ({
                url: `/review/review-count/${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        // /product/buyer-for-product/69183a15d61cd430dd18ee69
        getBuyerForProduct: builder.query({
            query: (id ) => ({
                // /product/buyer-for-product/69180f0ac42f1182f15bf467
                url: `/product/buyer-for-product/${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),

    }),
});

export const {
    useGetProductsQuery,
    useGetSingleProductQuery,
    useDisableProductQuery,
    useCreateOrderMutation,
    useCreateCheckoutSessionMutation,
    useGetProductsByFilterQuery,
    useGetSellerAboutQuery,
    useGetSellerFeedbackQuery,
    useGetReviewCountQuery,
    useGetBuyerForProductQuery,
} = productApi;