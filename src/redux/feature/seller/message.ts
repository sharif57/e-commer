import baseApi from "@/redux/api/baseApi";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // /message/get-recent-message
        getRecentMessage: builder.query({
            query: () => ({
                url: `/message/get-recent-message`,
                method: "GET",
            }),
            providesTags: ["Message"],
        }),
  
    }),
});

export const {
    useGetRecentMessageQuery
} = messageApi;