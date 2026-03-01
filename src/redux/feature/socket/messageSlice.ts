import baseApi from "@/redux/api/baseApi";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create or get inbox conversation by sending first message
       createInbox: builder.mutation({
  query: (receiverId: string) => ({
    url: `/inbox/send-message/${receiverId}`,
    method: "POST",
    body: { receiverId },
  }),
  invalidatesTags: ["Message"],
}),
        // Get inbox messages - returns inbox list with last message
        getInboxMessages: builder.query({
            query: (inboxId: string) => ({
                url: `/message/get-message/${inboxId}`,
                method: "GET",
            }),
            providesTags: ["Message"],
        }),
        // Get all inboxes
        getInboxList: builder.query({
            query: () => ({
                url: `/inbox/get-inbox`,
                method: "GET",
            }),
            providesTags: ["Message"],
        }),

        // /order/get-all-buyer-and-seller-order
        allBuyerAndSellerOrder: builder.query({
            query: (page) => ({
                url: `/order/get-all-buyer-and-seller-order?page=${page}`,
                method: "GET",
            }),
                providesTags: ["Message"],
        }),

    }),
});

export const {
    useCreateInboxMutation,
    useGetInboxMessagesQuery,
    useGetInboxListQuery,
    useAllBuyerAndSellerOrderQuery,
} = messageApi;