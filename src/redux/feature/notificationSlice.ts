import baseApi from "@/redux/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
//    /notification/get-notification
        getNotifications: builder.query({
            query: () => ({
                url: `/notification/get-notification`,
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

    }),
});

export const {
    useGetNotificationsQuery,
} = notificationApi;