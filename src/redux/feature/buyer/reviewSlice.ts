import baseApi from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /review/create-review
         createReview: builder.mutation({
            query: (reviewData) => ({
                url: `/review/create-review`,
                method: "POST",
                body: reviewData,
            }),
            invalidatesTags: ["Review"],
        }),
        // /review/get-all-data/69180f0ac42f1182f15bf467
        
        getAllReviews: builder.query({
            query: ({id,page}) => ({
                url: `/review/get-all-data/${id}`,
                method: "GET",
            }),
            providesTags: ["Review"],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useGetAllReviewsQuery
} = reviewApi;