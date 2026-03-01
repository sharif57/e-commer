import baseApi from "@/redux/api/baseApi";

export const wishListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //    /wishlist/get-all-wishlist
        getWishList: builder.query({
            query: () => ({
                url: `/wishlist/get-all-wishlist`,
                method: "GET",
            }),
            providesTags: ["WishList"],
        }),

        // /wishlist/add-to-wishlist/694a36507dee0218bae46add
        addToWishList: builder.mutation({
            query: (productId: string) => ({
                url: `/wishlist/add-to-wishlist/${productId}`,
                method: "POST",
            }),
            invalidatesTags: ["WishList"],
        }),

        removeFromWishList: builder.mutation({
            query: (wishlistItemId: string) => ({
                url: `/wishlist/remove-from-wishlist/${wishlistItemId}`,
                method: "POST",
            }),
            invalidatesTags: ["WishList"],
        }),

    }),
});

export const {
    useGetWishListQuery,
    useAddToWishListMutation,   
    useRemoveFromWishListMutation
} = wishListApi;