import baseApi from "@/redux/api/baseApi";

export const productSellerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (productData) => ({
                url: `/product/create-product`,
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["SellerProduct"],
        }),
        // /product/get-my-products
        getSellerProducts: builder.query({
            query: ({ inStock, page = 1 }: { inStock?: boolean, page?: number }) => {
                const params = new URLSearchParams();
                if (inStock !== undefined) {
                    params.append('inStock', String(inStock));
                }
                if (page) {
                    params.append('page', String(page));
                }
                const queryString = params.toString();
                return {
                    url: `/product/get-my-products${queryString ? `?${queryString}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: ["SellerProduct"],
        }),
        // /product/update/6932a71b7d740510efe6d7b0
        updateProduct: builder.mutation({
            query: ({ productId, data }) => ({
                url: `/product/update/${productId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["SellerProduct"],
        }),

        // /product/delete-product/6928179bffd11e8843772637
        deleteProduct: builder.mutation({
            query: (productId: string) => ({
                url: `/product/delete-product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SellerProduct"],
        }),


        // /order/get-order-by-seller
        getProducts: builder.query({
            query: () => ({
                url: `/order/get-order-by-seller`,
                method: "GET",
            }),
            providesTags: ["SellerProduct"],
        }),
        // /order/get-single-order/696a55c58986dc7e35e6901e
        getSingleProductSeller: builder.query({
            query: (id: string) => ({
                url: `/order/get-single-order/${id}`,
                method: "GET",
            }),
            providesTags: ["SellerProduct"],
        }),
        // /order-confirmation/order/69429cd73f24216802b35d57
        orderConfirmation: builder.mutation({
            query: ({ orderId, data }) => ({
                url: `/order-confirmation/order/${orderId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["SellerProduct"],
        }),

        // /product/create-product-draft
        createProductDraft: builder.mutation({
            query: (productData) => ({
                url: `/product/create-product-draft`,
                method: "POST",
                body: productData,
            }),
            invalidatesTags: ["SellerProduct"],
        }),
        // /product/get-my-products?searchTerm
        getDraftProducts: builder.query({
            query: () => ({
                url: `/product/get-my-products?searchTerm=draft`,
                method: "GET",
            }),
            providesTags: ["SellerProduct"],
        }),
        draftProductUpdate: builder.mutation({
            query: ({ productId, data }) => ({
                url: `/product/update/${productId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["SellerProduct"],
        }),

    }),
});

export const {
    useCreateProductMutation,
    useGetSellerProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useGetSingleProductSellerQuery,
    useOrderConfirmationMutation,
    useCreateProductDraftMutation,
    useGetDraftProductsQuery,
    useDraftProductUpdateMutation,
} = productSellerApi;