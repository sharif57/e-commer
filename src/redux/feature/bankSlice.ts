import baseApi from "@/redux/api/baseApi";

export const bankApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // /bank-card/add-card
        addBankCard: builder.mutation({
            query: (data) => ({
                url: `/bank-card/add-card`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        // /bank-card/get-my-card
        getMyCard: builder.query({
            query: () => ({
                url: `/bank-card/get-my-card`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        // /bank-card/connect-card/69df2777c2a78d8522e9288b
        connectCard: builder.mutation({
            query: ({ data, id }) => ({
                url: `/bank-card/connect-card/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        // /bank-card/delete-card/69df2777c2a78d8522e9288b
        deleteBankCard: builder.mutation({
            query: (id: string) => ({
                url: `/bank-card/delete-card/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

    }),
});

export const {
    useAddBankCardMutation,
    useGetMyCardQuery,
    useConnectCardMutation,
    useDeleteBankCardMutation,

} = bankApi;